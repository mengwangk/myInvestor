package com.myinvestor.technical.strategy

import java.util

import com.datastax.spark.connector._
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import eu.verdelhan.ta4j.{Tick, TimeSeries}
import org.apache.spark.SparkContext


/**
  * Technical indicators trading strategy.
  */
trait TAStrategy {

  import TradeSchema._

  val log = Logger(this.getClass.getName)

  val sc: SparkContext = SparkContextUtils.sparkContext

  // Stock category
  var category: String

  def getChosenStocks: Array[ChosenStock] = {
    val settings = new AppSettings
    sc.cassandraTable[ChosenStock](Keyspace, ChosenStockTable).where(CategoryColumn + " = ?", category).collect()
  }

  def getTimeSeries(exchangeName: String, stockSymbol: String): TimeSeries = {

    // Get the stock as list instead of RDD
    val stockHistories = sc.cassandraTable[StockHistory](Keyspace, StockHistoryTable).where(ExchangeNameColumn + " = ? AND " + StockSymbolColumn + " = ?", exchangeName, stockSymbol).collect()

    // ta4j required ticks
    val ticks = new util.ArrayList[Tick]()
    stockHistories.foreach { history =>
      ticks.add(new Tick(history.historyDate, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
    }
    new TimeSeries(exchangeName + "-" + stockSymbol, ticks)
  }

  def run: Boolean

}
