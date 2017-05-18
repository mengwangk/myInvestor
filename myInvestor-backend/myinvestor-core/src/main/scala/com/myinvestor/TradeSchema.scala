package com.myinvestor

import java.util.UUID

import com.datastax.spark.connector.mapper.DefaultColumnMapper
import org.joda.time.DateTime

/**
  * Database schema
  */
object TradeSchema {

  // Keyspace
  val Keyspace = "myinvestor"

  // Tables
  val RequestTable = "request"
  val ExchangeTable = "exchange"
  val StockTable = "stock"
  val StockHistoryTable = "stock_history"
  val StockInfoTable = "stock_info"
  val DividendSummaryTable = "dividend_summary"
  val DividendHistoryTable = "dividend_history"
  val G2YFinanceMappingTable = "g2yfinance_mapping"

  // Columns
  val ExchangeNameColumn = "exchange_name"
  val StockSymbolColumn = "stock_symbol"
  val YahooExchangeNameColumn = "y_exchange_name"
  val YahooStockSymbolColumn = "y_stock_symbol"
  val GoogleExchangeNameColumn = "g_exchange_name"
  val GoogleStockSymbolColumn = "g_stock_symbol"

  // Classes

  @SerialVersionUID(1L)
  trait TradeModel extends Serializable

  case class Request(requestId: UUID, success: Boolean, errorMsg: String, received: DateTime = DateTime.now())

  case class Exchange(exchangeName: String, description: String, stockCount: Int) extends TradeModel

  case class Stock(stockSymbol: String, stockName: String, exchangeName: String) extends TradeModel

  case class StockHistory(stockSymbol: String, exchangeName: String, historyDate: DateTime,
                          historyOpen: Double, historyHigh: Double, historyLow: Double, historyClose: Double,
                          historyVolume: Double) extends TradeModel

  case class StockInfo(stockSymbol: String, exchangeName: String,
                       info52weeksFrom: String, info52weeksTo: String,
                       infoBeta: String, infoChange: String, infoChangePercentage: String,
                       infoCurrentPrice: String, infoDividendYield: String, infoEps: String,
                       infoInstOwn: String, infoMarketCapital: String, infoOpen: String,
                       infoPe: String, infoRangeFrom: String, infoRangeTo: String, infoShares: String,
                       infoTime: String, infoVolume: String,
                       infoExtractedTimestamp: DateTime = DateTime.now()) extends TradeModel

  case class DividendSummary(gExchangeName: String, gStockSymbol: String, dividendYear: Int, dividend: Double,
                             currentPrice: Double, priceDate:DateTime, dividendYield: Double) extends TradeModel

  case class DividendHistory(yExchangeName: String, yStockSymbol: String, dividendDate: DateTime, dividend: Double) extends TradeModel

  case class G2YFinanceMapping(gStockSymbol: String, yStockSymbol: String, gExchangeName: String, gStockName: String, yExchangeName: String, yStockName: String)
    extends TradeModel

  // Object mapper
  object StockInfo {

    implicit object Mapper extends DefaultColumnMapper[StockInfo](
      Map(
        "info52weeksFrom" -> "info_52weeks_from",
        "info52weeksTo" -> "info_52weeks_to"
      )
    )

  }

  // ----- Processed trade analysis results
  trait TradeAnalysis extends TradeModel with Serializable {
    // Exchange name
    def exchangeName: String

    // Stock symbol
    def symbol: String
  }


  // -- This is for technical analysis results
  trait TechnicalAnalysis extends TradeAnalysis

  // -- This is the result to be returned...
  case class MovingAverage10(exchangeName: String, symbol: String) extends TechnicalAnalysis


  // -- Other results, e.g. fundamental analysis

}
