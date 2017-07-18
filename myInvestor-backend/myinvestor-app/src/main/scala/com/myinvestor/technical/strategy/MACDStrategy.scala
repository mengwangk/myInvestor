package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.Strategy
import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.trackers.{EMAIndicator, MACDIndicator, SMAIndicator}
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule}

/**
  * Lagging indicator.
  *
  * As a metric of price trends, the MACD is less useful for stocks that are not trending or are trading erratically
  *
  * Moving Average Convergence Divergence (MACD).
  *
  * <p>
  * As a lagging indicator, the
  * MACD is often paired with a leading indicator, like the Relative Strength Index (RSI).
  * </p>
  *
  * <p>
  *
  * @see https://github.com/mdeverdelhan/ta4j/issues/68
  *      </p>
  *
  */
class MACDStrategy(var category: String) extends TAStrategy {

  val ShortPeriod = 12
  val LongPeriod = 26
  val SignalPeriod = 9

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

          /////////////////////////////////////////////////////////////////
          val closePrice: ClosePriceIndicator = new ClosePriceIndicator(series)

          val macd = new MACDIndicator(closePrice, ShortPeriod, LongPeriod)
          val ema = new EMAIndicator(macd, SignalPeriod)

          // The standard interpretation is to buy when the
          // MACD line crosses up through the signal line, or sell when it crosses down through the signal line.
          val entryRule = new CrossedUpIndicatorRule(macd, ema)
          val exitRule = new CrossedDownIndicatorRule(macd, ema)

          /////////////////////////////////////////////////////////////////

          // Running the strategy
          val strategy = new Strategy(entryRule, exitRule)
          strategy.setUnstablePeriod(7)

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
