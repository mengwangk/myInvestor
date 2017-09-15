package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.indicators.SMAIndicator
import eu.verdelhan.ta4j.indicators.bollinger.{BollingerBandsLowerIndicator, BollingerBandsMiddleIndicator, BollingerBandsUpperIndicator}
import eu.verdelhan.ta4j.indicators.helpers.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.statistics.StandardDeviationIndicator
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule}
import eu.verdelhan.ta4j.{BaseStrategy, Rule, Strategy, TimeSeriesManager}

/**
  * Lagging indicator.
  *
  * Volatility indicator - Bollinger Bands.
  *
  * As a statistical analysis of the MA of price, Bollinger Bands are
  * a very effective tool for identifying potential reversal points, and as
  * confirmation of what other price, momentum, and volume signals
  * forecast.
  *
  * The best use of this signal is to mark likely turning points. For
  * example, when price touches the upper band, it could serve as a signal
  * to sell, and when it touches the lower band, it could serve as a buy
  * signal.
  *
  */
class BollingerBandsStrategy(var category: String) extends TAStrategy {

  def run: Boolean = {

    val AveragePeriod = 20
    val DeviationPeriod = 40

    var status = true
    try {
      for (stock <- getChosenStocks) {
        val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

        val closePrice = new ClosePriceIndicator(series)
        val avg14 = new SMAIndicator(closePrice, AveragePeriod) // Or use EMAIndicator
        val sd14 = new StandardDeviationIndicator(closePrice, DeviationPeriod)

        // Bollinger bands
        val middleBBand = new BollingerBandsMiddleIndicator(avg14)
        val lowBBand = new BollingerBandsLowerIndicator(middleBBand, sd14)
        val upBBand = new BollingerBandsUpperIndicator(middleBBand, sd14)

        // Entry rule
        val entryRule: Rule = new CrossedDownIndicatorRule(closePrice, lowBBand)

        // Exit rule
        val exitRule: Rule = new CrossedUpIndicatorRule(closePrice, upBBand)

        // Running the strategy
        val strategy = new BaseStrategy(entryRule, exitRule)
        val seriesManager = new TimeSeriesManager(series)
        val tradingRecord = seriesManager.run(strategy)
        printTradingRecord(series, tradingRecord)
      }
    } catch {
      case e: Exception => {
        log.error("[run] Unable to run strategy", e)
        status = false
      }
    }
    status
  }
}
