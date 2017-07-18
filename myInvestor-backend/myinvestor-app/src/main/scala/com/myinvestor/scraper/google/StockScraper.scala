package com.myinvestor.scraper.google

import com.datastax.spark.connector._
import com.myinvestor.SparkContextUtils
import com.myinvestor.TradeSchema._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.jsoup.Jsoup

/**
  * Scrap the stock symbol
  */
class StockScraper(val exchangeName: String) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  def run: Boolean = {
    val sc: SparkContext = SparkContextUtils.sparkContext
    var status = true

    // https://stackoverflow.com/questions/21086263/how-to-insert-double-quotes-into-string-with-interpolation-in-scala
    val search =
      s"""[(exchange == "$exchangeName")]"""
    val GoogleFinanceUrl = "https://www.google.com/finance?q=" + search + "&restype=company&noIL=1&num=8000&ei=5YbOV4ieA9exugTRyZOoCw"

    try {
      val response = Jsoup.connect(GoogleFinanceUrl).timeout(ConnectionTimeout)
        .userAgent("Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
        .execute()
      if (response.statusCode() == 200) {
        val document = response.parse()
        var stockCount = 0

        // Delete all the symbols first
        sc.cassandraTable(Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).deleteFromCassandra(Keyspace, StockTable)

        for (counter <- 1 to 10000) {
          val company = Option(stringValue(document.oneByCss("a#rc-" + counter)))
          val symbol = Option(stringValue(document.oneByCss("a#rct-" + counter)))
          if (company.exists(_.trim.nonEmpty)) {
            // Insert into stock table
            log.info(s"$counter - Saving $symbol.get - $company.get")
            stockCount += 1
            val stock = Stock(stockSymbol = symbol.get, stockName = company.get, exchangeName = exchangeName)
            sc.parallelize(Seq(stock)).saveToCassandra(Keyspace, StockTable)
          }
        }
        // Update exchange table
        val exchanges = sc.cassandraTable[Exchange](Keyspace, ExchangeTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()
        if (exchanges.length > 0) {
          val exchange = Exchange(exchangeName = exchanges.head.exchangeName, description = exchanges.head.description, stockCount = stockCount, yahooFinanceExchangeName = exchanges.head.yahooFinanceExchangeName)
          sc.parallelize(Seq(exchange)).saveToCassandra(Keyspace, ExchangeTable)
        }
        log.info("Completed")
      } else {
        log.info(s"Unable to grab stock for $exchangeName")
      }
    } catch {
      case e: Exception => {
        log.warn(s"Error getting stock symbol for $exchangeName, cause: ${e.getMessage}")
        status = false
      }
    }
    status
  }
}