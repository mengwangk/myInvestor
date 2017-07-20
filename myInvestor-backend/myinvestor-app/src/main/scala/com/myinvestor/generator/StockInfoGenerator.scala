package com.myinvestor.generator

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.jsoup.Jsoup

import scala.util.parsing.json.JSON

/**
  * Generate JSON file for all stocks under a exchange, and also HTTP POST
  * the info the the server.
  *
  * E.g. for NASDAQ the generated file is named NASDAQ.json
  *
  */
class StockInfoGenerator(val exchangeName: String) {

  def run: Unit = {

    val log = Logger(this.getClass.getName)

    val IGNORE_WORDS = Array("berhad", "bhd")


      import TradeSchema._
      val sc: SparkContext = SparkContextUtils.sparkContext

      val stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()
      val total = stocks.length
      var current = 0
      stocks.foreach { stock =>
        current = current + 1
        log.info(s"Procesing stock info for [$current/$total] $exchangeName  - ${stock.stockSymbol}")
      }
  }
}


case class StockDetails(exchangeName: String, stockSymbol: String, stockName: String,  currentPE: String)

