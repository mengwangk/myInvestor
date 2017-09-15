package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j._
import eu.verdelhan.ta4j.indicators.helpers.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.{EMAIndicator, MACDIndicator, StochasticOscillatorKIndicator}
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule, OverIndicatorRule, UnderIndicatorRule}

/**
  * Leading indicator.
  *
  * Momentum indicator - Moving momentum strategy.
  */
class MovingMomentumStrategy (var category: String) extends TAStrategy {

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

          val closePrice: ClosePriceIndicator = new ClosePriceIndicator(series)

          // The bias is bullish when the shorter-moving average moves above the longer moving average.
          // The bias is bearish when the shorter-moving average moves below the longer moving average.
          val shortEma: EMAIndicator = new EMAIndicator(closePrice, 9)
          val longEma: EMAIndicator = new EMAIndicator(closePrice, 26)

          val stochasticOscillK: StochasticOscillatorKIndicator = new StochasticOscillatorKIndicator(series, 14)

          val macd: MACDIndicator = new MACDIndicator(closePrice, 9, 26)
          val emaMacd: EMAIndicator = new EMAIndicator(macd, 18)

          // Entry rule
          val entryRule: Rule = new OverIndicatorRule(shortEma, longEma).and( // Trend
                                new CrossedDownIndicatorRule(stochasticOscillK, Decimal.valueOf(20))).and( // Signal 1
                                new OverIndicatorRule(macd, emaMacd)) // Signal 2


          // Exit rule
          val exitRule: Rule = new UnderIndicatorRule(shortEma, longEma).and(new CrossedUpIndicatorRule(stochasticOscillK, Decimal.valueOf(80))).and(new UnderIndicatorRule(macd, emaMacd))

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
