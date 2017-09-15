package com.myinvestor

import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext

/**
  * Simple testing
  */
class LanguageSpec extends UnitTestSpec {

  object WeekDay extends Enumeration {
    type WeekDay = Value
    val Mon, Tue, Wed, Thu, Fri, Sat, Sun = Value
  }


  "scala" should "should have these features" in {

    import WeekDay._

    def isWorkingDay(d: WeekDay) = ! (d == Sat || d == Sun)

    WeekDay.values filter isWorkingDay foreach println

  }
}
