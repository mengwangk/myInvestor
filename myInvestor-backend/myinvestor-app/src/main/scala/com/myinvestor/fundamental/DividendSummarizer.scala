package com.myinvestor.fundamental

import com.datastax.spark.connector._
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext

import scala.util.Try


/**
  * Get the dividend achievers.
  */
class DividendSummarizer(val exchangeName: String, val symbols: Option[Array[String]])  {

  val log = Logger(this.getClass.getName)

  def run: Boolean = {
    val settings = new AppSettings
    import TradeSchema._

    val sc: SparkContext = SparkContextUtils.sparkContext

    var status = true

    // Get a list of stocks to grab
    var stocks = Array[String]()
    if (symbols.isDefined && symbols.get.length > 0) {
      stocks = symbols.get
    } else {
      stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).map(stock=>stock.stockSymbol).collect()
    }

    val total = stocks.length
    var current = 0
    if (total > 0) {
      stocks.foreach { stockSymbol =>
        current = current + 1
        log.info(s"Summarizing stock dividend history for [$current/$total] ${exchangeName} - ${stockSymbol}")

        var summaries: Map[Int, Double] = Map[Int, Double]()
        // Get a list of mapped stocks from Yahoo Finance
        var mappedStocks = sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ? AND " + GoogleStockSymbolColumn + "= ?", exchangeName, stockSymbol).collect()
        mappedStocks.foreach { stock =>
          // Get the stock dividend histories
          val dividendHistories = sc.cassandraTable[DividendHistory](Keyspace, DividendHistoryTable).where(YahooExchangeNameColumn + " = ? AND " + YahooStockSymbolColumn + "= ?", stock.yExchangeName, stock.yStockSymbol).collect()
          dividendHistories.foreach { dividendHistory =>
            val dividend = summaries.get(dividendHistory.dividendDate.getYearOfEra)
            summaries += (dividendHistory.dividendDate.getYearOfEra -> (dividendHistory.dividend + (if (dividend.isDefined) dividend.get else 0)))
          }
        }
        var stockInfo: StockInfo = null

        // Get the latest price from stock info table, calculate the dividend yield to see if it is a dividend achiever
        val stockInfos = sc.cassandraTable[StockInfo](Keyspace, StockInfoTable).where(StockSymbolColumn + " = ? AND " + ExchangeNameColumn + "= ?", stockSymbol, exchangeName).collect
        if (stockInfos.length > 0) {
          stockInfo = stockInfos.head
        }

        if (stockInfo != null) {
          // Save summary to database table
          summaries.foreach { summary =>
            val currentPrice = Try {
              stockInfo.infoCurrentPrice.toDouble
            }.toOption
            if (currentPrice.isDefined && currentPrice.get > 0) {
              val dividendYield = BigDecimal(summary._2 / currentPrice.get * 100).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble
              val dividend = BigDecimal(summary._2).setScale(6, BigDecimal.RoundingMode.HALF_UP).toDouble
              sc.parallelize(
                Seq(
                  DividendSummary(gExchangeName = exchangeName, gStockSymbol = stockSymbol, dividendYear = summary._1, dividend = dividend ,
                    currentPrice = currentPrice.get, priceDate = stockInfo.infoExtractedTimestamp, dividendYield = dividendYield)
                )
              ).saveToCassandra(Keyspace, DividendSummaryTable)
            }
          }
        }
      }
    }
    status
  }
}
