package com.myinvestor

import com.datastax.spark.connector._
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext

import scala.util.Try

/**
  * Dividend summary as part fundamental analysis
  */
class DividendSummarySpec extends UnitTestSpec {

  def fixture =
    new {
      val log = Logger("DividendSummarySpec")
      val sc: SparkContext = SparkContextUtils.sparkContext
      val settings = new AppSettings()
    }

  "Dividend history" should "produce a list of good stocks" in {
    import TradeSchema._

    val sc: SparkContext = fixture.sc
    val log: Logger = fixture.log
    val exchangeName = "KLSE"

    // Get list of stocks for a particular exchange
    val stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()
    stocks.foreach { stock =>
      var summaries: Map[Int, Double] = Map[Int, Double]()
      // Get a list of mapped stocks from Yahoo Finance
      var mappedStocks = sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ? AND " + GoogleStockSymbolColumn + "= ?", exchangeName, stock.stockSymbol).collect()
      mappedStocks.foreach { stock =>
        // Get the stock dividend histories
        val dividendHistories = sc.cassandraTable[DividendHistory](Keyspace, DividendHistoryTable).where(YahooExchangeNameColumn + " = ? AND " + YahooStockSymbolColumn + "= ?", stock.yExchangeName, stock.yStockSymbol).collect()
        dividendHistories.foreach { dividendHistory =>
          val dividend = summaries.get(dividendHistory.dividendDate.getYearOfEra)
          summaries += (dividendHistory.dividendDate.getYearOfEra -> (dividendHistory.dividend + (if (dividend.isDefined) dividend.value else 0)))
        }
      }

      var stockInfo: StockInfo2 = null
      // Get the latest price from stock history table, calculate the dividend yield to see if it is a dividend achiever
      val stockInfos = sc.cassandraTable[StockInfo2](Keyspace, StockInfoTable).where(StockSymbolColumn + " = ? AND " + ExchangeNameColumn + "= ?", stock.stockSymbol, stock.exchangeName).collect
      if (stockInfos.length > 0) {
        stockInfo = stockInfos.head
      }

      if (stockInfo != null) {
        // Save summary to database table
        summaries.foreach { summary =>
          val currentPrice = Try {
            stockInfo.infoCurrentPrice.toDouble
          }.toOption
          if (currentPrice.isDefined && currentPrice.value > 0) {
            val dividendYield = BigDecimal(summary._2 / currentPrice.value * 100).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble
            val dividend = BigDecimal(summary._2).setScale(6, BigDecimal.RoundingMode.HALF_UP).toDouble
            sc.parallelize(
              Seq(
                DividendSummary(gExchangeName = stock.exchangeName, gStockSymbol = stock.stockSymbol, dividendYear = summary._1, dividend = dividend ,
                  currentPrice = currentPrice.value, priceDate = stockInfo.infoExtractedTimestamp, dividendYield = dividendYield)
              )
            ).saveToCassandra(Keyspace, DividendSummaryTable)
          }
        }
      }
    }
  }
}
