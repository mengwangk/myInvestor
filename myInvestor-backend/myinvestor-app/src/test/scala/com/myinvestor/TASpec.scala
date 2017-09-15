package com.myinvestor

import com.myinvestor.technical.strategy.{BollingerBandsStrategy, MACDStrategy, RSIStrategy}
import com.typesafe.scalalogging.Logger

/**
  * Unit testing for technical analysis.
  */
class TASpec extends UnitTestSpec {

  def fixture =
    new {
      val log = Logger("TASpec")
    }


  "Indicator" should "should have stocks" in {
    // val indicator = new CCICorrectionStrategy("KLSE >= 5%")
    // val indicator = new MovingMomentumStrategy("KLSE >= 5%")
    // val indicator = new RSIStrategy("KLSE >= 5%")
    //val indicator = new MACDStrategy("KLSE >= 5%")
    val indicator = new BollingerBandsStrategy("KLSE >= 5%")

    indicator.run
  }

}
