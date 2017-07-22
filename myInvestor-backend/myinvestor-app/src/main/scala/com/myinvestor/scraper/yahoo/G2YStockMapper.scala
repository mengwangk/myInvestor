package com.myinvestor.scraper.yahoo

import java.net.URLEncoder

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.jsoup.Jsoup

import scala.util.parsing.json.JSON

/**
  * Google Finance to Yahoo Finance stock symbol mapper.
  */
class G2YStockMapper(val exchangeName: String) extends ParserUtils with ParserImplicits {

  protected var mappedByName: Boolean = false

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

    // Delete existing mappings
    sc.cassandraTable(Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ?", exchangeName).deleteFromCassandra(Keyspace, G2YFinanceMappingTable)

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
        val jsonObject = JSON.parseFull(jsonResponse).get.asInstanceOf[Map[String, Any]]
        val resultSet = jsonObject.get("ResultSet").get.asInstanceOf[Map[String, Any]]
        val results = resultSet.get("Result").get.asInstanceOf[List[Map[String, Any]]]
        results.foreach { result =>
          val symbol = result.get("symbol").get.asInstanceOf[String]
          val name = result.get("name").get.asInstanceOf[String]
          val exch = result.get("exch").get.asInstanceOf[String]
          val _type = result.get("type").get.asInstanceOf[String]
          val exchDisp = result.get("exchDisp").get.asInstanceOf[String]
          val typeDisp = result.get("typeDisp").get.asInstanceOf[String]
          if (exch.equalsIgnoreCase(yahooExchangeName)) {
            // Save to Cassandra table
            val mappingTable = G2YFinanceMapping(gStockSymbol = stock.stockSymbol, yStockSymbol = symbol, gExchangeName = exchangeName, gStockName = stock.stockName,
                                                  yExchangeName = yahooExchangeName, yStockName = name)
            sc.parallelize(Seq(mappingTable)).saveToCassandra(Keyspace, G2YFinanceMappingTable)
          }
        }
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

