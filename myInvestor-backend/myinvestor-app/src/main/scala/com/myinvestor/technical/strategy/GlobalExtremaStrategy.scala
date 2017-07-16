package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.{Decimal, Rule, Strategy}
import eu.verdelhan.ta4j.indicators.helpers.{HighestValueIndicator, LowestValueIndicator}
import eu.verdelhan.ta4j.indicators.simple.{ClosePriceIndicator, MaxPriceIndicator, MinPriceIndicator, MultiplierIndicator}
import eu.verdelhan.ta4j.trading.rules.{OverIndicatorRule, UnderIndicatorRule}

/**
  * Global extrema strategy.
  */
class GlobalExtreamStrategy (var category: String) extends TAStrategy {

  // We assume that there were at least one trade every 5 minutes during the whole week// We assume that there were at least one trade every 5 minutes during the whole week
  private val NB_TICKS_PER_WEEK = 12 * 24 * 7

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

          val closePrices: ClosePriceIndicator = new ClosePriceIndicator(series)

          // Getting the max price over the past week
          val maxPrices: MaxPriceIndicator = new MaxPriceIndicator(series)
          val weekMaxPrice: HighestValueIndicator = new HighestValueIndicator(maxPrices, NB_TICKS_PER_WEEK)

          // Getting the min price over the past week
          val minPrices: MinPriceIndicator = new MinPriceIndicator(series)
          val weekMinPrice: LowestValueIndicator = new LowestValueIndicator(minPrices, NB_TICKS_PER_WEEK)

          // Going long if the close price goes below the min price
          val downWeek: MultiplierIndicator = new MultiplierIndicator(weekMinPrice, Decimal.valueOf("1.004"))
          val buyingRule: Rule = new UnderIndicatorRule(closePrices, downWeek)

          // Going short if the close price goes above the max price
          val upWeek: MultiplierIndicator = new MultiplierIndicator(weekMaxPrice, Decimal.valueOf("0.996"))
          val sellingRule: Rule = new OverIndicatorRule(closePrices, upWeek)

          val strategy = new Strategy(buyingRule, sellingRule)

          // Running the strategy
          val tradingRecord = series.run(strategy)
          printTradingRecord(series, tradingRecord)
        }
    catch {
      case e: Exception => {
        log.error("[run] Unable to run strategy", e)
        status = false
      }
    }
    status
  }
}
