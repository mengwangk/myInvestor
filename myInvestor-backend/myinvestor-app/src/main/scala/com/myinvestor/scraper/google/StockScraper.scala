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
      s"""[(exchange=="$exchangeName")]"""
    // val GoogleFinanceUrl =
    //  "https://finance.google.com/finance?q=" + search + "&restype=company&noIL=1&num=4304&ei=E5G8WbD7JdSougT33rS4DA"

    val GoogleFinanceUrl =
    //s"""https://finance.google.com/finance?q=[(exchange=="$exchangeName")]&ei=HKq8WdijMJm8uAT53o1g&restype=company&noIL=1&start=1&num=8000""".stripMargin
      s"""https://finance.google.com/finance?q=[(exchange=="$exchangeName")]&restype=company&noIL=1&num=8000&ei=Ppu8Wfm0C8azuwSugpvABQ""".stripMargin
    try {
      // https://stackoverflow.com/questions/39555567/jsoup-returning-different-output-from-web-browser
      // https://stackoverflow.com/questions/10640093/jsoup-getting-different-html-compared-to-firefox-and-other-browsers
      // https://stackoverflow.com/questions/20019656/jsoup-returning-incomplete-html-document
      val connection = Jsoup.connect(GoogleFinanceUrl)
      connection.maxBodySize(0)
      val response = connection.timeout(ConnectionTimeout)
        .userAgent(USER_AGENT)
        .execute()
      if (response.statusCode() == 200) {
        val document = response.parse()
        //println(document.body().toString)
        var stockCount = 0

        // Delete all the symbols first
        sc.cassandraTable(Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).deleteFromCassandra(Keyspace, StockTable)

        for (counter <- 1 to 8000) {
          val company = Option(stringValue(document.oneByCss("a#rc-" + counter)))
          val symbol = Option(stringValue(document.oneByCss("a#rct-" + counter)))
          if (company.exists(_.trim.nonEmpty) && symbol.exists(_.trim.nonEmpty) ) {
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
          val exchange = Exchange(exchangeName = exchanges.head.exchangeName, description = exchanges.head.description,
            stockCount = stockCount, yahooFinanceExchangeName = exchanges.head.yahooFinanceExchangeName, countryCode = exchanges.head.countryCode)
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