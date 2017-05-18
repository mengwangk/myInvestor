package com.myinvestor.model

/**
  * Utility class for Cassandra schema.
  */
object CassandraSchema {

  // Keyspace
  val KEYSPACE  = "myinvestor"

  // Tables
  val EXCHANGE_TABLE = "exchange"
  val STOCK_TABLE = "stock"
  val STOCK_HISTORY_TABLE = "stock_history"
  val STOCK_DETAILS_TABLE = "stock_details"

  // Columns
  val EXCHANGE_ID_COLUMN = "exchange_id"
  val EXCHANGE_NAME_COLUMN = "exchange_name"
  val STOCK_SYMBOL_COLUMN = "stock_symbol"
  val STOCK_NAME_COLUMN = "stock_name"
  val HISTORY_DATE = "history_date"
  val HISTORY_CLOSE = "history_close"
  val HISTORY_HIGH = "history_high"
  val HISTORY_LOW = "history_low"
  val HISTORY_OPEN = "history_open"
  val HISTORY_VOLUME = "history_volume"
}
