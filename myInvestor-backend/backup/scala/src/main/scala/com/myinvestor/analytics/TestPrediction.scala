package com.myinvestor.analytics

import java.util

import com.myinvestor.model.CassandraModel.{Stock, StockHistory}
import eu.verdelhan.ta4j.analysis.CashFlow
import eu.verdelhan.ta4j.analysis.criteria.{AverageProfitableTradesCriterion, RewardRiskRatioCriterion, TotalProfitCriterion, VersusBuyAndHoldCriterion}
import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.trackers.SMAIndicator
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule, StopGainRule, StopLossRule}
import eu.verdelhan.ta4j._
import org.apache.spark.rdd.RDD

/**
  * Simple prediction used for testing.
  */
class TestPrediction {

  def apply(stock: Stock, rdd: RDD[StockHistory]): Unit = {

    // ta4j required ticks
    val ticks = new util.ArrayList[Tick]()

    // Transform to ta4j Tick
    val histories = rdd.collect()
    histories.foreach { history =>
      ticks.add(new Tick(history.historyDate, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
    }
    val series = new TimeSeries(stock.stockSymbol, ticks)

    // Building the trading strategy
    val firstClosePrice = series.getTick(0).getClosePrice();
    println(firstClosePrice.toDouble)

    val closePrice = new ClosePriceIndicator(series)
    println(firstClosePrice.isEqual(closePrice.getValue(0)))

    val shortSma = new SMAIndicator(closePrice, 5)
    println("5-ticks-SMA value at the 42nd index: " + shortSma.getValue(42).toDouble())

    val longSma = new SMAIndicator(closePrice, 30)

    // Ok, now let's building our trading rules!

    // Buying rules
    // We want to buy:
    //  - if the 5-ticks SMA crosses over 30-ticks SMA
    //  - or if the price goes below a defined price (e.g $800.00)
    val buyingRule = new CrossedUpIndicatorRule(shortSma, longSma).or(new CrossedDownIndicatorRule(closePrice, Decimal.valueOf("1.43")))

    // Selling rules
    // We want to sell:
    //  - if the 5-ticks SMA crosses under 30-ticks SMA
    //  - or if if the price looses more than 3%
    //  - or if the price earns more than 2%
    val sellingRule = new CrossedDownIndicatorRule(shortSma, longSma).or(new StopLossRule(closePrice, Decimal.valueOf("3"))).or(new StopGainRule(closePrice, Decimal.valueOf("2")))

    // Running our juicy trading strategy...
    val tradingRecord = series.run(new Strategy(buyingRule, sellingRule))
    println("Number of trades for our strategy: " + tradingRecord.getTradeCount())


    // Analysis

    // Getting the cash flow of the resulting trades
    val cashFlow = new CashFlow(series, tradingRecord)

    // Getting the profitable trades ratio
    val profitTradesRatio = new AverageProfitableTradesCriterion()
    println("Profitable trades ratio: " + profitTradesRatio.calculate(series, tradingRecord))

    // Getting the reward-risk ratio
    val rewardRiskRatio = new RewardRiskRatioCriterion()
    println("Reward-risk ratio: " + rewardRiskRatio.calculate(series, tradingRecord))

    // Total profit of our strategy
    // vs total profit of a buy-and-hold strategy
    val vsBuyAndHold = new VersusBuyAndHoldCriterion(new TotalProfitCriterion())
    println("Our profit vs buy-and-hold profit: " + vsBuyAndHold.calculate(series, tradingRecord))

    // Your turn!

  }
}
