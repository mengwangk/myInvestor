package com.myinvestor.scraper.yahoo

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import yahoofinance.YahooFinance

/**
  * Scrap stock info from Yahoo Finance.
  *
  * <p>
  *
  * @see https://support.klipfolio.com/hc/en-us/articles/215546368-Use-Yahoo-Finance-as-a-data-source-
  * @see http://wern-ancheta.com/blog/2015/04/05/getting-started-with-the-yahoo-finance-api/
  * @see https://stackoverflow.com/questions/10040954/alternative-to-google-finance-api
  *      </p>
  */
class StockInfoScraper2(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  def run: Boolean = {

    import TradeSchema._
    val sc: SparkContext = SparkContextUtils.sparkContext
    var status = true

    // Get a list of stocks to grab
    var stocks = Array[String]()
    if (symbols.isDefined && symbols.get.length > 0) {
      stocks = symbols.get
    } else {
      stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).map(stock => stock.stockSymbol).collect()
    }
    val total = stocks.length
    var current = 0
    stocks.foreach { stockSymbol =>
      current = current + 1
      val mappedStocks = sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ? AND " + GoogleStockSymbolColumn + " = ?", exchangeName, stockSymbol).collect()
      mappedStocks.foreach { mappedStock =>
        log.info(s"Grabbing stock info for [$current/$total] ${mappedStock.yExchangeName}  - ${mappedStock.yStockSymbol}")
        try {
          // Grab stock information for each stock
          val stock = YahooFinance.get(mappedStock.yStockSymbol, true)
          stock.print()

        } catch {
          case e: Exception => {
            log.warn(s"Skipping symbol - $stockSymbol, cause: ${e.getMessage}")
            status = false
          }
        }

      }
    }
    status
  }
}

