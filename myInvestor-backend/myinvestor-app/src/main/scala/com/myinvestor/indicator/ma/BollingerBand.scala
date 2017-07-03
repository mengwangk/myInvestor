package com.myinvestor.indicator.ma

import com.myinvestor.indicator.Indicator
import com.myinvestor.{AppSettings, SparkContextUtils}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext

/**
  * Bollinger band indicator.
  */
class BollingerBand extends Indicator{

  val log = Logger(this.getClass.getName)

  def run: Boolean = {
    val settings = new AppSettings
    val sc: SparkContext = SparkContextUtils.sparkContext
    var status = true

    status
  }

}
