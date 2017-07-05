package com.myinvestor.technical.indicator

import com.datastax.spark.connector._
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext


/**
  * Technical indicators.
  */
trait Indicator {

  val log = Logger(this.getClass.getName)

  // Stock category
  var category: String

  def getChosenStock():Unit = {

    val settings = new AppSettings
    import TradeSchema._

    val sc: SparkContext = SparkContextUtils.sparkContext
    val chosenStocks:Array[ChosenStock] =  sc.cassandraTable[ChosenStock](Keyspace, ChosenStockTable).where(CategoryColumn + " = ?", category).collect()

  }
}
