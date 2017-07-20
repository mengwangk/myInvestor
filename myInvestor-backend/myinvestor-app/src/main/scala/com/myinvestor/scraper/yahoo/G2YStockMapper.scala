package com.myinvestor.scraper.yahoo

import java.net.URLEncoder

import com.datastax.spark.connector._
import com.myinvestor.scraper.{JsonUtils, ParserImplicits, ParserUtils}
import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.jsoup.Jsoup

import scala.util.parsing.json.JSON

/**
  * Google Finance to Yahoo Finance stock symbol mapper.
  */
class G2YStockMapper(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  protected var mappedByName: Boolean = true

  val log = Logger(this.getClass.getName)

  val IGNORE_WORDS = Array("berhad", "bhd")

  def run: Boolean = {

    import TradeSchema._
    val sc: SparkContext = SparkContextUtils.sparkContext
    var status = true

    // Get a list of stocks to grab
    var yahooExchangeName = ""
    val exchanges = sc.cassandraTable[Exchange](Keyspace, ExchangeTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()
    if (exchanges.length > 0) {
        yahooExchangeName = exchanges.head.yahooFinanceExchangeName
    } else {
      log.error(s"Invalid exchange name - $exchangeName")
      return false
    }

    var stocks = Array[Stock]()
    stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()
    val total = stocks.length
    var current = 0
    stocks.foreach { stock =>
      current = current + 1
      log.info(s"Mapping stock info for [$current/$total] $exchangeName  - ${stock.stockSymbol}")
      try {
        var searchTerm = ""
        if (mappedByName) {
          searchTerm = stock.stockName
          IGNORE_WORDS.foreach { word =>
            searchTerm = searchTerm.replaceAll("(?i)" + word, "")
          }
          searchTerm = URLEncoder.encode(searchTerm, "UTF-8")
        } else {
          searchTerm = stock.stockSymbol
        }
        val YahooQueryUrl = s"http://autoc.finance.yahoo.com/autoc?query=$searchTerm&region=EU&lang=en-GB"
        val jsonResponse = Jsoup.connect(YahooQueryUrl).timeout(ConnectionTimeout).ignoreContentType(true)
                        .userAgent(USER_AGENT)
                        .execute().body()
        val jsonObject = JSON.parseFull(jsonResponse)


      } catch {
        case e: Exception => {
          log.warn(s"Skipping symbol - ${stock.stockSymbol}, cause: ${e.getMessage}")
          status = false
        }
      }
    }
    status
  }
}

