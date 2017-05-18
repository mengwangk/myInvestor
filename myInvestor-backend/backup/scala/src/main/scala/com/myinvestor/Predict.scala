package com.myinvestor

import com.datastax.spark.connector._
import com.myinvestor.analytics.CCICorrection
import com.myinvestor.common.Settings
import com.myinvestor.model.CassandraModel.{Stock, StockHistory}
import com.myinvestor.model.CassandraSchema
import com.typesafe.scalalogging.Logger
import org.apache.spark.{SparkConf, SparkContext}

/**
  * Perform prediction.
  */
object Predict {

  def main(args: Array[String]) {
    val logger = Logger("Predict")
    val settings = new Settings()

    val sparkConf = new SparkConf(true)
      .set("spark.cassandra.connection.host", settings.cassandraHost)
      .set("spark.cassandra.auth.username", settings.cassandraUser)
      .set("spark.cassandra.auth.password", settings.cassandraUserPassword)
    val sc = new SparkContext(settings.sparkMaster, settings.sparkAppName, sparkConf)

    // Set the analytics algorithm
    val prediction = new CCICorrection()

    // Get the stock as list instead of RDD
    val stocks = sc.cassandraTable[Stock](CassandraSchema.KEYSPACE, CassandraSchema.STOCK_TABLE).where(CassandraSchema.EXCHANGE_ID_COLUMN + " = ?", settings.exchangeId).collect()

    // Test the algorithm using 1 stock now
    val stock = Stock("YTLPOWR", 1, "YTL Power")  // Sample stock
    val stockHistoryRdd = sc.cassandraTable[StockHistory](CassandraSchema.KEYSPACE, CassandraSchema.STOCK_HISTORY_TABLE).select(
      CassandraSchema.STOCK_SYMBOL_COLUMN, CassandraSchema.HISTORY_DATE, CassandraSchema.HISTORY_CLOSE, CassandraSchema.HISTORY_HIGH,
      CassandraSchema.HISTORY_LOW, CassandraSchema.HISTORY_OPEN, CassandraSchema.HISTORY_VOLUME
    ).where(CassandraSchema.STOCK_SYMBOL_COLUMN + " = ?", stock.stockSymbol)

    prediction.apply(stock, stockHistoryRdd)

    /*
    stocks.foreach { stock =>
      // Get the stock history for this stock
      val stockHistoryRdd = sc.cassandraTable[StockHistory](CassandraSchema.KEYSPACE, CassandraSchema.STOCK_HISTORY_TABLE).select(
        CassandraSchema.STOCK_SYMBOL_COLUMN, CassandraSchema.HISTORY_DATE, CassandraSchema.HISTORY_CLOSE, CassandraSchema.HISTORY_HIGH,
        CassandraSchema.HISTORY_LOW, CassandraSchema.HISTORY_OPEN, CassandraSchema.HISTORY_VOLUME
      ).where(CassandraSchema.STOCK_SYMBOL_COLUMN + " = ?", stock.stockSymbol)

      prediction.apply(stock, stockHistoryRdd)
    }
    */
  }
}
