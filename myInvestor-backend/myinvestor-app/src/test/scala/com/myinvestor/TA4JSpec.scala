package com.myinvestor

import java.util

import com.datastax.spark.connector._
import com.typesafe.scalalogging.Logger
import eu.verdelhan.ta4j._
import eu.verdelhan.ta4j.analysis.criteria.TotalProfitCriterion
import eu.verdelhan.ta4j.indicators.helpers.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.{CCIIndicator, RSIIndicator, SMAIndicator}
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule, OverIndicatorRule, UnderIndicatorRule}
import org.apache.spark.SparkContext

/**
  * Technical analysis test cases.
  */
class TA4JSpec extends UnitTestSpec {

  def fixture =
    new {
      val log = Logger("TechnicalAnalysisSpec")
      val sc: SparkContext = SparkContextUtils.sparkContext
      val settings = new AppSettings()
    }

  //"KLSE"
  ignore should "should have stocks with good returns" in {

    import TradeSchema._

    val sc: SparkContext = fixture.sc
    val log: Logger = fixture.log

    // Get the stock as list instead of RDD
    val klseStocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", "KLSE").collect()

    assert(klseStocks.length > 0)

    /*
    klseStocks.foreach { stock =>
      //println(stock.stockSymbol)
      // Get the stock histories
      val stockHistories = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(StockSymbolColumn + " = ?", stock.stockSymbol).collect()
      println(stockHistories)
    }
    */
  }

  //"CCI Indicator"
  ignore should "applies successfully for YTLPOWR" in {

    import TradeSchema._

    val sc: SparkContext = fixture.sc
    val log: Logger = fixture.log

    val symbol = "MAYBANK"

    // Get the stock as list instead of RDD
    val stockHistories = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(StockSymbolColumn + " = ?", symbol).collect()

    assert(stockHistories.length >= 0)

    // ta4j required ticks

    val ticks = new util.ArrayList[Tick]()

    stockHistories.foreach { history =>
      ticks.add(new BaseTick(history.historyDate.toGregorianCalendar.toZonedDateTime, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
    }
    val series = new BaseTimeSeries(symbol, ticks)

    // Build the trading strategy
    val longCci = new CCIIndicator(series, 200)
    val shortCci = new CCIIndicator(series, 5)
    val plus100 = Decimal.HUNDRED
    val minus100 = Decimal.valueOf(-100)

    val entryRule = new OverIndicatorRule(longCci, plus100) // Bull trend
      .and(new UnderIndicatorRule(shortCci, minus100)); // Signal

    val exitRule = new UnderIndicatorRule(longCci, minus100) // Bear trend
      .and(new OverIndicatorRule(shortCci, plus100)); // Signal

    val strategy = new BaseStrategy(entryRule, exitRule)
    strategy.setUnstablePeriod(5)

    // Running the strategy
    val seriesManager = new TimeSeriesManager(series)
    val tradingRecord = seriesManager.run(strategy)
    println("Number of trades for the strategy: " + tradingRecord.getTradeCount)
    println("Trade size: " + tradingRecord.getTrades().size())
    println("Trade entry price: " + tradingRecord.getTrades().get(0).getEntry.getPrice)
    println("Trade exit price: " + tradingRecord.getTrades().get(0).getExit.getPrice)

    // Analysis
    println("Total profit for the strategy: " + new TotalProfitCriterion().calculate(series, tradingRecord))

  }

  // "CCI indicator"
  ignore should "produce trades for KLSE stocks" in {
    import TradeSchema._

    val sc: SparkContext = fixture.sc
    val log: Logger = fixture.log
    val exchangeName = "KLSE"

    // Get the stock as list instead of RDD
    val stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()

    assert(stocks.length > 0)

    stocks.foreach { stock =>
      // Get the stock histories
      val stockHistories = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(StockSymbolColumn + " = ?", stock.stockSymbol).collect()

      val ticks = new util.ArrayList[Tick]()

      stockHistories.foreach { history =>
        ticks.add(new BaseTick(history.historyDate.toGregorianCalendar.toZonedDateTime, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
      }

      val series = new BaseTimeSeries(stock.stockSymbol, ticks)

      // Build the trading strategy
      val longCci = new CCIIndicator(series, 200)
      val shortCci = new CCIIndicator(series, 5)
      val plus100 = Decimal.HUNDRED
      val minus100 = Decimal.valueOf(-100)

      val entryRule = new OverIndicatorRule(longCci, plus100) // Bull trend
        .and(new UnderIndicatorRule(shortCci, minus100)); // Signal

      val exitRule = new UnderIndicatorRule(longCci, minus100) // Bear trend
        .and(new OverIndicatorRule(shortCci, plus100)); // Signal

      val strategy = new BaseStrategy(entryRule, exitRule)
      strategy.setUnstablePeriod(5)

      // Running the strategy
      val seriesManager = new TimeSeriesManager(series)
      val tradingRecord = seriesManager.run(strategy)
      if (tradingRecord.getTradeCount > 0) {
        println("Number of trades for [" + stock.stockSymbol + "] - " + tradingRecord.getTradeCount)
        println("Total profit for the strategy: " + new TotalProfitCriterion().calculate(series, tradingRecord))
      }
    }
  }

  "RSI indicator" should "produce trades for KLSE stocks" in {
    import TradeSchema._

    val sc: SparkContext = fixture.sc
    val log: Logger = fixture.log
    val exchangeName = "KLSE"

    // Get the stock as list instead of RDD
    val stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()

    assert(stocks.length > 0)

    stocks.foreach { stock =>
      // Get the stock histories
      val stockHistories = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(StockSymbolColumn + " = ?", stock.stockSymbol).collect()

      val ticks = new util.ArrayList[Tick]()

      stockHistories.foreach { history =>
        ticks.add(new BaseTick(history.historyDate.toGregorianCalendar.toZonedDateTime, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
      }

      val series = new BaseTimeSeries(stock.stockSymbol, ticks)

      val closePrice = new ClosePriceIndicator(series)
      val shortSma = new SMAIndicator(closePrice, 5)
      val longSma = new SMAIndicator(closePrice, 200)

      // We use a 2-period RSI indicator to identify buying
      // or selling opportunities within the bigger trend.
      val rsi = new RSIIndicator(closePrice, 2)

      // Entry rule
      // The long-term trend is up when a security is above its 200-period SMA.
      val entryRule = new OverIndicatorRule(shortSma, longSma) // Trend
        .and(new CrossedDownIndicatorRule(rsi, Decimal.valueOf(5))) // Signal 1
        .and(new OverIndicatorRule(shortSma, closePrice)); // Signal 2

      // Exit rule
      // The long-term trend is down when a security is below its 200-period SMA.
      val exitRule = new UnderIndicatorRule(shortSma, longSma) // Trend
        .and(new CrossedUpIndicatorRule(rsi, Decimal.valueOf(95))) // Signal 1
        .and(new UnderIndicatorRule(shortSma, closePrice)); // Signal 2


      val strategy = new BaseStrategy(entryRule, exitRule)

      // Running the strategy
      val seriesManager = new TimeSeriesManager(series)
      val tradingRecord = seriesManager.run(strategy)
      if (tradingRecord.getTradeCount > 0) {
        println("Number of trades for [" + stock.stockSymbol + "] - " + tradingRecord.getTradeCount)
        println("Total profit for the strategy: " + new TotalProfitCriterion().calculate(series, tradingRecord))
      }

      // If there are 2 strategies, choose the best
      // Strategy bestStrategy = criterion.chooseBest(series, Arrays.asList(strategy1, strategy2));
    }
  }
}

