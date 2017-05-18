package com.myinvestor.analytics

import java.util

import com.myinvestor.analytics.strategy.CCICorrectionStrategy
import com.myinvestor.model.CassandraModel.{Stock, StockHistory}
import eu.verdelhan.ta4j.analysis.criteria.TotalProfitCriterion
import eu.verdelhan.ta4j.{Tick, TimeSeries}
import org.apache.spark.rdd.RDD

/**
  * CCI (Commodity Channel Index) Correction strategy.
  */
class CCICorrection {

  def apply(stock: Stock, rdd: RDD[StockHistory]) {

    // ta4j required ticks
    val ticks = new util.ArrayList[Tick]()

    // Transform to ta4j Tick
    val histories = rdd.collect()
    histories.foreach { history =>
      ticks.add(new Tick(history.historyDate, history.historyOpen, history.historyHigh, history.historyLow, history.historyClose, history.historyVolume))
    }
    val series = new TimeSeries(stock.stockSymbol, ticks)
    val strategyBuilder = new CCICorrectionStrategy()

    // Building the trading strategy
    val strategy = strategyBuilder.builder(series)

    // Running the strategy
    val tradingRecord = series.run(strategy)
    println("Number of trades for the strategy: " + tradingRecord.getTradeCount)

    // Analysis
    println("Total profit for the strategy: " + new TotalProfitCriterion().calculate(series, tradingRecord))

  }
}
