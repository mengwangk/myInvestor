package com.myinvestor.scraper.yahoo

import java.io.File
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
import java.net.CookieHandler
import java.net.CookiePolicy

import scala.Array._
import scala.io.Source
import scala.sys.process._

/**
  * Dividend history scraper.
  */
class DividendHistoryScraper(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  def fileDownloader(url: String, filename: String) = {
    new URL(url) #> new File(filename) !!
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
    var stocks = Array[String]()
    if (symbols.isDefined) {
      // Search for the Yahoo Finance stock symbols
      val searchSymbols = symbols.get
      searchSymbols.foreach { symbol =>
        stocks = concat(stocks, sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ? AND " + GoogleStockSymbolColumn + " = ?", exchangeName, symbol).map(stock => stock.yStockSymbol).collect())
      }
    } else {
      stocks = sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ?", exchangeName).map(stock => stock.yStockSymbol).collect()
    }


    val total = stocks.length
    var current = 0
    if (total > 0) {
      // Create the temp folder
      val tempDir = tempDirectory(AppName)
      val sqlContext = SparkContextUtils.sparkSqlContext
      val now = DateTime.now.getMillis
      val past10years = DateTime.now.minusYears(10).getMillis
      val dtFormatter = DateTimeFormat.forPattern("dd-MMM-yy")

      stocks.foreach { stockSymbol =>
        val symbol = URLEncoder.encode(stockSymbol, "UTF-8")
        val YahooFinanceDividendHistoryUrl = s"https://query1.finance.yahoo.com/v7/finance/download/$symbol?period1=1148572800&period2=1495728000&interval=1d&events=div&crumb=xZCgl1rxPCP"
        current = current + 1
        log.info(s"Grabbing stock history for [$current/$total] $exchangeName - $stockSymbol")

        try {

          val cookieManager = new CookieManager()
          CookieHandler.setDefault(cookieManager)
          val  cookieStore = cookieManager.getCookieStore()
          cookieStore.

          // Download the history to a file
          val content = Source.fromURL(YahooFinanceDividendHistoryUrl)
          println(content)
          //val fileName = tempDir + File.separator + symbol
          //fileDownloader(YahooFinanceDividendHistoryUrl, fileName)
         // import org.jsoup.Jsoup
         // val bytes = Jsoup.connect(YahooFinanceDividendHistoryUrl).timeout(ConnectionTimeout).ignoreContentType(true).cookie("finance.yahoo.com", symbol)
         //   .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1").execute.bodyAsBytes
          //println(bytes.length)

          /*
          // Use Spark SQL to process the CSV file
          val reader = sqlContext.read.format("csv").option("header", "true").option("mode", "DROPMALFORMED").load(fileName)
          val records = reader.select("*").collect()
          if (records.length > 10) {
            records.foreach { row =>
              val dt = row.getString(0)
              val parsedDt = DateTime.parse(dt, dtFormatter)
              val open = numberValue(row.getString(1))
              val high = numberValue(row.getString(2))
              val low = numberValue(row.getString(3))
              val close = numberValue(row.getString(4))
              val volume = numberValue(row.getString(5))

              // Save to database
              val stockHistory = StockHistory(stockSymbol = stockSymbol, exchangeName = exchangeName, historyDate = parsedDt,
                historyOpen = open, historyHigh = high, historyLow = low, historyClose = close, historyVolume = volume)
              // println (stockHistory)
              sc.parallelize(Seq(stockHistory)).saveToCassandra(Keyspace, StockHistoryTable)
            }
            // Perform validation
            val lastValidDate = DateTime.parse(records(records.length - 1).getString(0), dtFormatter) // .formatted("dd-MM-yyyy")
            val fileRowCount = records.length
            val dbRowCount = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(ExchangeNameColumn + " = ? AND "
              + StockSymbolColumn + " = ? " + " AND " + HistoryDateColumn + " >= ? ", exchangeName, stockSymbol, lastValidDate).cassandraCount()
            log.info("--- File row count [" + fileRowCount + "] ----- Database record count [" + dbRowCount + "]")

          } else {
            log.warn(s"Skipping symbol - $stockSymbol")
          }
          */
          // Delete the temporary file
          //Files.deleteIfExists(Paths.get(fileName))
        }
        catch {
          case e: Exception => {
            log.warn(s"Skipping symbol - $stockSymbol, cause: ${e.getMessage}")
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

