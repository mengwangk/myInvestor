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
  val HistoryDateColumn = "history_date"
  val YahooExchangeNameColumn = "y_exchange_name"
  val YahooStockSymbolColumn = "y_stock_symbol"
  val GoogleExchangeNameColumn = "g_exchange_name"
  val GoogleStockSymbolColumn = "g_stock_symbol"

  // Classes

  @SerialVersionUID(1L)
  trait ObjectModel extends Serializable

  case class Request(requestId: UUID, success: Boolean, errorMsg: String, received: DateTime = DateTime.now())

  case class Exchange(exchangeName: String, description: String, stockCount: Int) extends ObjectModel

  case class Stock(stockSymbol: String, stockName: String, exchangeName: String) extends ObjectModel

  case class StockHistory(stockSymbol: String, exchangeName: String, historyDate: DateTime,
                          historyOpen: Double, historyHigh: Double, historyLow: Double, historyClose: Double,
                          historyVolume: Double) extends ObjectModel

  case class StockInfo(stockSymbol: String, exchangeName: String,
                       info52weeksFrom: String, info52weeksTo: String,
                       infoBeta: String, infoChange: String, infoChangePercentage: String,
                       infoCurrentPrice: String, infoDividendYield: String, infoEps: String,
                       infoInstOwn: String, infoMarketCapital: String, infoOpen: String,
                       infoPe: String, infoRangeFrom: String, infoRangeTo: String, infoShares: String,
                       infoTime: String, infoVolume: String,
                       infoExtractedTimestamp: DateTime = DateTime.now()) extends ObjectModel

  case class DividendSummary(gExchangeName: String, gStockSymbol: String, dividendYear: Int, dividend: Double,
                             currentPrice: Double, priceDate:DateTime, dividendYield: Double) extends ObjectModel

  case class DividendHistory(yExchangeName: String, yStockSymbol: String, dividendDate: DateTime, dividend: Double) extends ObjectModel

  case class G2YFinanceMapping(gStockSymbol: String, yStockSymbol: String, gExchangeName: String, gStockName: String, yExchangeName: String, yStockName: String)
    extends ObjectModel

  // Object mapper
  object StockInfo {

    implicit object Mapper extends DefaultColumnMapper[StockInfo](
      Map(
        "info52weeksFrom" -> "info_52weeks_from",
        "info52weeksTo" -> "info_52weeks_to"
      )
    )

  }

  // Web scraping request
  trait WebScraping extends ObjectModel
  case class WebScrapingResult(status: Boolean) extends WebScraping


  // ----- Processed trade analysis results
  trait Analysis extends ObjectModel with Serializable {
    // Exchange name
    def exchangeName: String

    // Stock symbol
    def symbols: Option[Array[String]]
  }

  // -- This is for fundamental analysis results
  trait FA extends Analysis

  // -- This is the result to be returned...
  case class DivdendAchieverAnalysis(exchangeName: String, symbols: Option[Array[String]]) extends FA


  // -- This is for technical analysis results
  trait TA extends Analysis

  // -- This is the result to be returned...
  case class BollingerBandAnalysis(exchangeName: String, symbols: Option[Array[String]]) extends TA


}
