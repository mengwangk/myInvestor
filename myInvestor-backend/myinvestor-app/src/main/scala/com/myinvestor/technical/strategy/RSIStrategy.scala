package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.indicators.RSIIndicator
import eu.verdelhan.ta4j.indicators.helpers.ClosePriceIndicator
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule}
import eu.verdelhan.ta4j.{BaseStrategy, Decimal, Rule, TimeSeriesManager}

/**
  * Leading indicator.
  *
  * Momentum indicator - RSI strategy.
  */
class RSIStrategy (var category: String) extends TAStrategy {

  // Use the most recent X sessions
  val Period = 14

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)
          val closePrice: ClosePriceIndicator = new ClosePriceIndicator(series)

          val rsi: RSIIndicator = new RSIIndicator(closePrice, Period)

          // Entry rule
          val entryRule: Rule = new CrossedDownIndicatorRule(rsi, Decimal.valueOf(30))

          // Exit rule
          val exitRule: Rule = new CrossedUpIndicatorRule(rsi, Decimal.valueOf(70))

          // Running the strategy
          val strategy = new BaseStrategy(entryRule, exitRule)
          val seriesManager = new TimeSeriesManager(series)
          val tradingRecord = seriesManager.run(strategy)
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
