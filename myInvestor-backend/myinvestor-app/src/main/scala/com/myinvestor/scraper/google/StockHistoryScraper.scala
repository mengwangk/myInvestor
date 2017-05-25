package com.myinvestor.scraper.google

import java.io.File
import java.net.{URL, URLEncoder}
import java.nio.file.{Files, Paths}

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.apache.spark.sql.SparkSession
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

import scala.sys.process._

/**
  * Stock history scraper.
  */
class StockHistoryScraper(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  def fileDownloader(url: String, filename: String) = {
    new URL(url) #> new File(filename) !!
  }

  def tempDirectory(folderName: String): String = {
    val dir = Paths.get(System.getProperty("java.io.tmpdir"))
    //val appPath: Path = dir.getFileSystem.getPath(folderName)
    val tempPath = Files.createTempDirectory(dir, folderName)
    //if (name.getParent != null) throw new IllegalArgumentException("Invalid prefix or suffix")
    //dir.resolve(name).toString
    // dir.toString
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
      stocks = symbols.get
    } else {
      stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).map(stock => stock.stockSymbol).collect()
    }
    val total = stocks.length
    var current = 0
    if (total > 0) {
      // Create the temp folder
      val tempDir = tempDirectory(AppName)
      val sqlContext = SparkContextUtils.sparkSqlContext
      val dtFormatter = DateTimeFormat.forPattern("dd-MMM-yy")

      stocks.foreach { stockSymbol =>
        val symbol = URLEncoder.encode(stockSymbol, "UTF-8")
        val GoogleFinanceStockHistoryUrl = s"http://www.google.com/finance/historical?q=$exchangeName%3A$symbol&ei=zsb0V4H5K5LQuATWx7_oDQ&output=csv"
        current = current + 1
        log.info(s"Grabbing stock history for [$current/$total] $exchangeName - $stockSymbol")
        try {
          // Download the history to a file
          //val content = Source.fromURL(GoogleFinanceStockHistoryUrl)
          val fileName = tempDir + File.separator + symbol
          fileDownloader(GoogleFinanceStockHistoryUrl, fileName)

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
          // Delete the temporary file
          Files.deleteIfExists(Paths.get(fileName))
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
