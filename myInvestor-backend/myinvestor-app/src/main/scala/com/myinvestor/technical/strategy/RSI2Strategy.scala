package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.indicators.helpers.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.{RSIIndicator, SMAIndicator}
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule, OverIndicatorRule, UnderIndicatorRule}
import eu.verdelhan.ta4j._

/**
  * Momentum indicator - 2-Period RSI (Relative Strength Index) strategy.
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
