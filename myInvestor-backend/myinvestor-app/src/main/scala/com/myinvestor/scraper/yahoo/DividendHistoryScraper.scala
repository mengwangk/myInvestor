package com.myinvestor.scraper.yahoo

import java.io.{File, FileOutputStream}
import java.net._
import java.nio.file.{Files, Paths}

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.apache.spark.sql.SparkSession
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

import scala.Array._

/**
  * Dividend history scraper.
  */
class DividendHistoryScraper(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  /*
   ## Capture by Fiddler
   GET /v7/finance/download/6742.KL?period1=1274803200&period2=1495728000&interval=1d&events=div&crumb=xZCgl1rxPCP HTTP/1.1
   Host: query1.finance.yahoo.com
   Connection: keep-alive
   Upgrade-Insecure-Requests: 1
   User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
   Accept-Encoding: gzip, deflate, sdch, br
   Accept-Language: en-US,en;q=0.8
   Cookie: B=aih3bu9cdvb24&b=3&s=27;PRF=t%3D6742.KL%252BYHOO%252B4448.KL%252B%255EIXIC%252BTKCS.KL%252B4448P.KL%252B4952.KL%252B5185.KL%252BMRCY%252B6556.KL%252B0823EA.KL%252B2577.KL
   */

  def downloadDividendHistory(sourceURL: String, fileName: String): Boolean = {
    try {
      val url = new URL(sourceURL)
      val httpConn = url.openConnection.asInstanceOf[HttpURLConnection]
      // IMPORTANT
      httpConn.setRequestProperty("Cookie", "B=aih3bu9cdvb24&b=3&s=27;PRF=t%3D6742.KL%252BYHOO%252B4448.KL%252B%255EIXIC%252BTKCS.KL%252B4448P.KL%252B4952.KL%252B5185.KL%252BMRCY%252B6556.KL%252B0823EA.KL%252B2577.KL")
      val responseCode = httpConn.getResponseCode
      // always check HTTP response code first
      if (responseCode == HttpURLConnection.HTTP_OK) {
        // opens input stream from the HTTP connection
        val inputStream = httpConn.getInputStream
        // opens an output stream to save into file
        val outputStream = new FileOutputStream(fileName)
        var bytesRead = -1
        val buffer = new Array[Byte](5096)
        bytesRead = inputStream.read(buffer)
        while (bytesRead != -1) {
          outputStream.write(buffer, 0, bytesRead)
          bytesRead = inputStream.read(buffer)
        }
        outputStream.close()
        inputStream.close()
        httpConn.disconnect()
        true
      } else {
        log.warn("No file to download. Server replied HTTP code: " + responseCode)
        httpConn.disconnect()
        false
      }
    } catch {
      case e: Exception => {
        log.warn(s"Unable to download, cause: ${e.getMessage}")
        false
      }
    }
  }

  def tempDirectory(folderName: String): String = {
    val dir = Paths.get(System.getProperty("java.io.tmpdir"))
    val tempPath = Files.createTempDirectory(dir, folderName)
    tempPath.toString
  }

  def run: Boolean = {
    val settings = new AppSettings
    import TradeSchema._
    import settings._

    val sc: SparkContext = SparkContextUtils.sparkContext
    val ss: SparkSession = SparkContextUtils.sparkSession

    var status = true

    // Get a list of stocks to grab
    var stocks = Array[G2YFinanceMapping]()
    if (symbols.isDefined) {
      // Search for the Yahoo Finance stock symbols
      val searchSymbols = symbols.get
      searchSymbols.foreach { symbol =>
        stocks = concat(stocks, sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ? AND " + GoogleStockSymbolColumn + " = ?", exchangeName, symbol).collect())
      }
    } else {
      stocks = sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ?", exchangeName).collect()
    }

    val total = stocks.length
    var current = 0
    if (total > 0) {
      // Create the temp folder
      val tempDir = tempDirectory(AppName)
      val sqlContext = SparkContextUtils.sparkSqlContext
      val now = DateTime.now.getMillis / 1000 // Convert to seconds
      val past10years = DateTime.now.minusYears(10).getMillis / 1000 // Convert to seconds
      val dtFormatter = DateTimeFormat.forPattern("yyyy-MM-dd")

      stocks.foreach { stock =>
        val symbol = URLEncoder.encode(stock.yStockSymbol, "UTF-8")
        val YahooFinanceDividendHistoryUrl = s"https://query1.finance.yahoo.com/v7/finance/download/$symbol?period1=$past10years&period2=$now&interval=1d&events=div&crumb=xZCgl1rxPCP"
        current = current + 1
        log.info(s"Grabbing stock history for [$current/$total] ${stock.yExchangeName} - ${stock.yStockSymbol}")
        try {
          val fileName = tempDir + File.separator + symbol
          if (downloadDividendHistory(YahooFinanceDividendHistoryUrl, fileName)) {
            // Use Spark SQL to process the CSV file
            val reader = sqlContext.read.format("csv").option("header", "true").option("mode", "DROPMALFORMED").load(fileName)
            val records = reader.select("*").collect()
            if (records.length > 1) {
              records.foreach { row =>
                val dt = row.getString(0)
                val parsedDt = DateTime.parse(dt, dtFormatter)
                val amount = numberValue(row.getString(1))

                // Save to database
                val dividendHistory = DividendHistory(yExchangeName = stock.yExchangeName, yStockSymbol = stock.yStockSymbol, dividendDate = parsedDt, dividend = amount)
                //println (dividendHistory)
                sc.parallelize(Seq(dividendHistory)).saveToCassandra(Keyspace, DividendHistoryTable)
              }
            } else {
              log.warn(s"Skipping symbol - ${stock.yStockSymbol}")
            }
          } else {
            log.warn(s"Skipping symbol - ${stock.yStockSymbol}")
          }

          // Delete the temporary file
          Files.deleteIfExists(Paths.get(fileName))
        }
        catch {
          case e: Exception => {
            log.warn(s"Skipping symbol - ${stock.yStockSymbol}, cause: ${e.getMessage}")
            status = false
          }
        }
      }
      // Remove the temp directory
      Files.deleteIfExists(Paths.get(tempDir))
    }
    status
  }
}

