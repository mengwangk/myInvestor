package com.myinvestor.technical.indicator.volatility

import com.myinvestor.technical.indicator.TAIndicator
import eu.verdelhan.ta4j.indicators.simple.ClosePriceIndicator
import eu.verdelhan.ta4j.indicators.statistics.StandardDeviationIndicator
import eu.verdelhan.ta4j.indicators.trackers.EMAIndicator
import eu.verdelhan.ta4j.indicators.trackers.bollinger.{BollingerBandsLowerIndicator, BollingerBandsMiddleIndicator, BollingerBandsUpperIndicator}
/**
  * Bollinger band indicator. Used as confirming signal.
  */
class BollingerBands(var category: String) extends TAIndicator {

  // Default values
  val NPeriod = 20  // N period moving average
  val KBand = 2     // K times N-period standard deviation above and below the middle band

  def run: Boolean = {
    var status = true
    for (stock <- getChosenStocks) {
      val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

      // Close price
      val closePrice = new ClosePriceIndicator(series)
      val eMAIndicator = new EMAIndicator(closePrice, NPeriod)
      val standardDeviationIndicator = new StandardDeviationIndicator(closePrice, NPeriod)

      // Bollinger bands
      val middleBBand = new BollingerBandsMiddleIndicator(eMAIndicator)
      val lowBBand = new BollingerBandsLowerIndicator(middleBBand, standardDeviationIndicator)
      val upBBand = new BollingerBandsUpperIndicator(middleBBand, standardDeviationIndicator)
    }
    status
  }
}
