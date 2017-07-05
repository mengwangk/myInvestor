package com.myinvestor.technical.indicator.trend

import com.myinvestor.technical.indicator.Indicator
import com.myinvestor.{AppSettings, SparkContextUtils}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext

/**
  * Bollinger band indicator.
  */
class BollingerBands(var category: String) extends Indicator{

  def run: Boolean = {
    val settings = new AppSettings
    val sc: SparkContext = SparkContextUtils.sparkContext
    var status = true

    status
  }

}
