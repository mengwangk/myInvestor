package com.myinvestor.technical.strategy

/**
  * Technical analysis indicators.
  */
object TAIndicator {

  /**
    * Indicator base class.
    */
  abstract class Indicator extends Enumeration {
    def getIndicator(s: String): Option[Value] = values.find(_.toString.equalsIgnoreCase(s))
  }

  /**
    * Momentum indicators.
    */
  object MomentumIndicator extends Indicator {

    type MomentumIndicator = Value

    val CCI, RSI, Stochastic = Value

  }

  /**
    * Trend indicators.
    */
  object TrendIndicator extends Indicator {

    type TrendIndicator = Value

    val MACD = Value

  }

  /**
    * Volatility indicators.
    */
  object VolatilityIndicator extends Indicator {

    type VolatilityIndicator = Value

    val BollingerBand = Value

  }

  /**
    * Volume indicators.
    */
  object VolumeIndicator extends Indicator {

    type VolumeIndicator = Value

    val MoneyFlowIndex = Value

  }

}
