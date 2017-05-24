package com.myinvestor.scraper.google

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{DataFrame, Dataset, Row, SparkSession}
import org.apache.spark.{SparkConf, SparkContext}

import scala.io.Source

/**
  * Stock history scraper.
  */
class StockHistoryScraper(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  def run: Boolean = {

    import TradeSchema._

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
    stocks.foreach { stockSymbol =>
      val symbol = stockSymbol
      val GoogleFinanceStockHistoryUrl = s"http://www.google.com/finance/historical?q=$exchangeName%3A$symbol&ei=zsb0V4H5K5LQuATWx7_oDQ&output=csv"
      current = current + 1
      log.info(s"Grabbing stock history for [$current/$total] $exchangeName - $stockSymbol")
      try {
        val content = Source.fromURL(GoogleFinanceStockHistoryUrl)
        val df = ss.read.format("csv").option("header", "true").option("mode", "DROPMALFORMED").csv()
      }
      catch {
        case e: Exception => {
          log.warn(s"Skipping symbol - $symbol, cause: ${e.getMessage}")
          status = false
        }
      }
    }
    status
  }
}
