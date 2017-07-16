package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.{Decimal, Rule, Strategy}
import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.trackers.{RSIIndicator, SMAIndicator}
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule, OverIndicatorRule, UnderIndicatorRule}

/**
  * 2-Period RSI Strategy.
  */
class RSI2Strategy(var category: String) extends TAStrategy {

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)


          val closePrice: ClosePriceIndicator = new ClosePriceIndicator(series)
          val shortSma: SMAIndicator = new SMAIndicator(closePrice, 5)
          val longSma: SMAIndicator = new SMAIndicator(closePrice, 200)

          // We use a 2-period RSI indicator to identify buying
          // or selling opportunities within the bigger trend.
          val rsi: RSIIndicator = new RSIIndicator(closePrice, 2)

          // Entry rule
          // The long-term trend is up when a security is above its 200-period SMA.
          val entryRule: Rule = new OverIndicatorRule(shortSma, longSma).and(new CrossedDownIndicatorRule(rsi, Decimal.valueOf(5))).and(new OverIndicatorRule(shortSma, closePrice)) // Signal 2

          // Exit rule
          // The long-term trend is down when a security is below its 200-period SMA.
          val exitRule: Rule = new UnderIndicatorRule(shortSma, longSma).and(new CrossedUpIndicatorRule(rsi, Decimal.valueOf(95))).and(new UnderIndicatorRule(shortSma, closePrice))

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
