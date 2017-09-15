package com.myinvestor.technical.strategy

import java.util

import com.datastax.spark.connector._
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import eu.verdelhan.ta4j._
import eu.verdelhan.ta4j.analysis.criteria._
import org.apache.spark.SparkContext

import scala.collection.JavaConversions._

/**
  * Technical indicators trading strategy.
  */
trait TAStrategy {

  import TradeSchema._

  val log = Logger(this.getClass.getName)

  val sc: SparkContext = SparkContextUtils.sparkContext

  // Stock category
  var category: String

  def getChosenStocks: Array[ChosenStock] = {
    val settings = new AppSettings
    sc.cassandraTable[ChosenStock](Keyspace, ChosenStockTable).where(CategoryColumn + " = ?", category).collect()
  }

  def getTimeSeries(exchangeName: String, stockSymbol: String): TimeSeries = {

    // Get the stock as list instead of RDD
    val stockHistories = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(ExchangeNameColumn + " = ? AND " + StockSymbolColumn + " = ?", exchangeName, stockSymbol).collect()

    // ta4j required ticks
    val ticks = new util.ArrayList[Tick]()
    stockHistories.foreach { history =>
      ticks.add(new BaseTick(history.historyDate.toGregorianCalendar.toZonedDateTime, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
    }
    new BaseTimeSeries(exchangeName + "-" + stockSymbol, ticks)
  }

  def printTradingRecord(series: TimeSeries, tradingRecord: TradingRecord): Unit = {
    if (tradingRecord.getTradeCount <= 0) return

    println("Series: " + series.getName)
    println("Number of trades: " + tradingRecord.getTradeCount)

    // Total profit
    val totalProfit = new TotalProfitCriterion()
    println("Total profit: " + totalProfit.calculate(series, tradingRecord))

    // Number of ticks
    println("Number of ticks: " + new NumberOfTicksCriterion().calculate(series, tradingRecord))

    // Average profit (per tick)
    println("Average profit (per tick): " + new AverageProfitCriterion().calculate(series, tradingRecord))

    // Number of trades
    println("Number of trades: " + new NumberOfTradesCriterion().calculate(series, tradingRecord))

    // Profitable trades ratio
    println("Profitable trades ratio: " + new AverageProfitableTradesCriterion().calculate(series, tradingRecord))

    // Maximum drawdown
    println("Maximum drawdown: " + new MaximumDrawdownCriterion().calculate(series, tradingRecord))

    // Reward-risk ratio
    println("Reward-risk ratio: " + new RewardRiskRatioCriterion().calculate(series, tradingRecord))

    // Total transaction cost
    println("Total transaction cost (from $1000): " + new LinearTransactionCostCriterion(1000, 0.005).calculate(series, tradingRecord))

    // Buy-and-hold
    println("Buy-and-hold: " + new BuyAndHoldCriterion().calculate(series, tradingRecord))

    // Total profit vs buy-and-hold
    println("Custom strategy profit vs buy-and-hold strategy profit: " + new VersusBuyAndHoldCriterion(totalProfit).calculate(series, tradingRecord))

    printTrade(series, tradingRecord)

    println()
    println()

  }

  def printTrade(series: TimeSeries, tradingRecord: TradingRecord):Unit = {
    // Details of each trades
    for (trade: Trade <- tradingRecord.getTrades) {

      println("Entry Order")
      println("------------")
      val entryOrder: Order = trade.getEntry
      val entryTick: Tick =  series.getTick(trade.getEntry.getIndex)
      println(entryOrder.toString)
      println(entryTick.toString)

      println("Exit Order")
      println("------------")
      val exitOrder: Order = trade.getExit
      val exitTick: Tick = series.getTick(trade.getExit.getIndex)
      println(exitOrder.toString)
      println(exitTick.toString)

      /*
      val exitClosePrice = series.getTick(trade.getExit.getIndex).getClosePrice
      val entryClosePrice = series.getTick(trade.getEntry.getIndex).getClosePrice
      println("Exit Price: " + exitClosePrice)
      println("Entry Price: " + entryClosePrice)
      if (trade.isClosed) {
        val exitClosePrice = series.getTick(trade.getExit.getIndex).getClosePrice
        val entryClosePrice = series.getTick(trade.getEntry.getIndex).getClosePrice
        if (trade.getEntry.isBuy)
          println(entryClosePrice)
        else
          println(exitClosePrice)
      }
      */
    }
  }

  def run: Boolean

}
