package com.myinvestor.model

import org.joda.time.DateTime

object CassandraModel {

  @SerialVersionUID(1L)
  sealed trait DatabaseModel extends Serializable


  /**
    * Exchange model.
    *
    * @param exchangeId
    * @param exchangeName
    */
  case class Exchange(exchangeId: Int, exchangeName: String) extends DatabaseModel

  /**
    * Stock model.
    *
    * @param stockSymbol
    * @param exchangeId
    * @param stockName
    */
  case class Stock(stockSymbol: String, exchangeId: Int, stockName: String) extends DatabaseModel

  /**
    * Stock history model.
    *
    * @param stockSymbol
    * @param historyDate
    * @param historyClose
    * @param historyHigh
    * @param historyLow
    * @param historyOpen
    * @param historyVolume
    */
  case class StockHistory(stockSymbol: String, historyDate: DateTime,
                          historyClose: Double, historyHigh: Double,
                          historyLow: Double, historyOpen: Double,
                          historyVolume: Double) extends DatabaseModel

}