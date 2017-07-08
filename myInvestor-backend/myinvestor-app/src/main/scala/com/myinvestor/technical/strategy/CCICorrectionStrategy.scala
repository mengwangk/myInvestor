package com.myinvestor.technical.strategy

import eu.verdelhan.ta4j.{Decimal, Strategy}
import eu.verdelhan.ta4j.analysis.criteria.TotalProfitCriterion
import eu.verdelhan.ta4j.indicators.oscillators.CCIIndicator
import eu.verdelhan.ta4j.trading.rules.{OverIndicatorRule, UnderIndicatorRule}

/**
  * Commodity Channel Index (CCI) indicator.
  */
class CCICorrectionStrategy(var category: String) extends TAStrategy {

  val LongPeriod = 200
  val ShortPeriod = 5

  def run: Boolean = {
    var status = true
    try {
      for (stock <- getChosenStocks) {
        val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)

        // Build the trading strategy
        val longCci = new CCIIndicator(series, LongPeriod)
        val shortCci = new CCIIndicator(series, ShortPeriod)
        val plus100 = Decimal.HUNDRED
        val minus100 = Decimal.valueOf(-100)

        val entryRule = new OverIndicatorRule(longCci, plus100) // Bull trend
          .and(new UnderIndicatorRule(shortCci, minus100)); // Signal

        val exitRule = new UnderIndicatorRule(longCci, minus100) // Bear trend
          .and(new OverIndicatorRule(shortCci, plus100)); // Signal

        val strategy = new Strategy(entryRule, exitRule)
        strategy.setUnstablePeriod(ShortPeriod)

        // Running the strategy
        val tradingRecord = series.run(strategy)
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
