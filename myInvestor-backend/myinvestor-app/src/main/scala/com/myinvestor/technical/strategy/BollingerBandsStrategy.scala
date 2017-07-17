package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.{Decimal, Rule, Strategy}
import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.trackers.RSIIndicator
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule}

/**
  * Volatility indicator - Bollinger Bands
  */
class BollingerBandsStrategy (var category: String) extends TAStrategy {

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)
          val closePrice: ClosePriceIndicator = new ClosePriceIndicator(series)

          // Use the most recent 14 sessions
          val rsi: RSIIndicator = new RSIIndicator(closePrice, 14)

          // Entry rule
          val entryRule: Rule = new CrossedDownIndicatorRule(rsi, Decimal.valueOf(30))

          // Exit rule
          val exitRule: Rule = new CrossedUpIndicatorRule(rsi, Decimal.valueOf(70))

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
