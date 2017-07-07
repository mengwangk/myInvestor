package com.myinvestor.technical.strategy

/**
  * Commodity Channel Index (CCI) indicator.
  */
class CCICorrectionStrategy(var category: String) extends TAStrategy {

  def run: Boolean = {
    var status = true
    try {
      for (stock <- getChosenStocks) {
        val series = getTimeSeries(stock.exchangeName, stock.stockSymbol)


      }
    } catch {
      case e: Exception => {
        log.error("[run] Unable to run strategy", e)
        status = false
      }
    }
    status
  }
}
