package com.myinvestor.technical.trading

import com.myinvestor.technical.strategy.TAStrategy
import eu.verdelhan.ta4j.indicators.helpers.ClosePriceIndicator
import eu.verdelhan.ta4j.{Decimal, TimeSeries}
/**
  * Automated trading bot.
  */
class TradingBot (var category: String) extends TAStrategy {

  /** Close price of the last tick */
  var LAST_TICK_CLOSE_PRICE: Decimal = _

  /**
    * Builds a moving time series (i.e. keeping only the maxTickCount last ticks)
    *
    * @param series Time series
    * @param maxTickCount the number of ticks to keep in the time series (at maximum)
    * @return a moving time series
    */
  def initMovingTimeSeries(series: TimeSeries, maxTickCount: Int): TimeSeries = {
    System.out.print("Initial tick count: " + series.getTickCount)

    // Limitating the number of ticks to maxTickCount
    series.setMaximumTickCount(maxTickCount)

    LAST_TICK_CLOSE_PRICE = series.getTick(series.getEndIndex).getClosePrice

    println(" (limited to " + maxTickCount + "), close price = " + LAST_TICK_CLOSE_PRICE)

    series
  }

  def run: Boolean = {
    var status = true
    try
        for (stock <- getChosenStocks) {
          val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)
          val closePrice = new ClosePriceIndicator(series)


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
