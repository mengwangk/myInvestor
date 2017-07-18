package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.statistics.StandardDeviationIndicator
import eu.verdelhan.ta4j.indicators.trackers.EMAIndicator
import eu.verdelhan.ta4j.indicators.trackers.bollinger.{BollingerBandsLowerIndicator, BollingerBandsMiddleIndicator, BollingerBandsUpperIndicator}
import eu.verdelhan.ta4j.trading.rules.{CrossedDownIndicatorRule, CrossedUpIndicatorRule}
import eu.verdelhan.ta4j.{Decimal, Rule, Strategy}

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
class BollingerBandsStrategy (var category: String) extends TAStrategy {

  def run: Boolean = {

    val AveragePeriod = 20
    val DeviationPeriod = 14

    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

          val closePrice = new ClosePriceIndicator(series)
          val avg14 = new EMAIndicator(closePrice, AveragePeriod)
          val sd14 = new StandardDeviationIndicator(closePrice, DeviationPeriod)

          // Bollinger bands
          val middleBBand = new BollingerBandsMiddleIndicator(avg14)
          val lowBBand = new BollingerBandsLowerIndicator(middleBBand, sd14)
          val upBBand = new BollingerBandsUpperIndicator(middleBBand, sd14)

          /*
          // Entry rule
          val entryRule: Rule = new CrossedDownIndicatorRule(rsi, Decimal.valueOf(30))

          // Exit rule
          val exitRule: Rule = new CrossedUpIndicatorRule(rsi, Decimal.valueOf(70))

          // Running the strategy
          val strategy = new Strategy(entryRule, exitRule)
          val tradingRecord = series.run(strategy)
          printTradingRecord(series, tradingRecord)
          */
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
