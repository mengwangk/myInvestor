package com.myinvestor.analytics.strategy

import eu.verdelhan.ta4j.indicators.oscillators.CCIIndicator
import eu.verdelhan.ta4j.trading.rules.{OverIndicatorRule, UnderIndicatorRule}
import eu.verdelhan.ta4j.{Decimal, Strategy, TimeSeries}


/**
  * CCI Correction Strategy.
  *
  * <p>
  *
  * @see http://stockcharts.com/school/doku.php?id=chart_school:trading_strategies:cci_correction
  *      </p>
  */
class CCICorrectionStrategy {

  def builder(series: TimeSeries): Strategy = {
    if (series == null) {
      throw new IllegalArgumentException("Series cannot be null")
    }

    val longCci = new CCIIndicator(series, 200)
    val shortCci = new CCIIndicator(series, 5)
    val plus100 = Decimal.HUNDRED
    val minus100 = Decimal.valueOf(-100)

    val entryRule = new OverIndicatorRule(longCci, plus100) // Bull trend
      .and(new UnderIndicatorRule(shortCci, minus100)); // Signal

    val exitRule = new UnderIndicatorRule(longCci, minus100) // Bear trend
      .and(new OverIndicatorRule(shortCci, plus100)); // Signal

    val strategy = new Strategy(entryRule, exitRule)
    strategy.setUnstablePeriod(5)
    strategy
  }
}
