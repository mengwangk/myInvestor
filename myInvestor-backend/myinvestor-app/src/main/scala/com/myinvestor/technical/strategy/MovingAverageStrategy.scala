package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.{Decimal, Strategy}
import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.trackers.SMAIndicator
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule, StopGainRule, StopLossRule}

/**
  * Moving average strategy.
  */
class MovingAverageStrategy (var category: String) extends TAStrategy {

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

          val closePrice = new ClosePriceIndicator(series)

          // Getting the simple moving average (SMA) of the close price over the last 5 ticks

          val shortSma = new SMAIndicator(closePrice, 5)

          // Getting a longer SMA (e.g. over the 30 last ticks)
          val longSma = new SMAIndicator(closePrice, 30)


          // Buying rules
          // We want to buy:
          //  - if the 5-ticks SMA crosses over 30-ticks SMA
          val entryRule = new CrossedUpIndicatorRule(shortSma, longSma)

          // Selling rules
          // We want to sell:
          //  - if the 5-ticks SMA crosses under 30-ticks SMA
          //  - or if if the price looses more than 3%
          //  - or if the price earns more than 2%
          val exitRule = new CrossedDownIndicatorRule(shortSma, longSma)

          // Running the strategy
          val strategy = new Strategy(entryRule, exitRule)
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