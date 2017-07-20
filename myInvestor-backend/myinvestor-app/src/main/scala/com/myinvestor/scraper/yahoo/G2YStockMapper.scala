package com.myinvestor.scraper.yahoo

import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.myinvestor.TradeSchema._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import yahoofinance.YahooFinance

/**
  * Google Finance to Yahoo Finance stock symbol mapper.
  */
class G2YStockMapper (val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

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
          val stock = YahooFinance.get(mappedStock.yStockSymbol)
          val currentPrice = stock.getQuote(true).getPrice
          val pe = stock.getStats.getPe
          log.info(s"currentPrice: $currentPrice, PE: $pe")

          // Update table
          if (currentPrice.doubleValue() > 0 && pe.doubleValue() > 0) {
            val stockInfo = StockInfo(stockSymbol = stockSymbol, exchangeName = exchangeName, infoCurrentPrice = currentPrice, infoPe = pe)
            sc.parallelize(Seq(stockInfo)).saveToCassandra(Keyspace, StockInfoTable)
          }
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

