package com.myinvestor.scraper.google

import java.net.URLEncoder

import com.datastax.spark.connector._
import com.myinvestor.scraper.{ParserImplicits, ParserUtils}
import com.myinvestor.{SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.joda.time.DateTime
import org.jsoup.Jsoup

/**
  * Grab stock information
  */
class StockInfoScraper(val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  val log = Logger(this.getClass.getName)

  def run: Boolean = {

    import TradeSchema._
    val sc: SparkContext = SparkContextUtils.sparkContext
    var status = true

    // Get a list of stocks to grab
    var stocks = Array[String]()
    if (symbols.isDefined && symbols.get.length > 0) {
      stocks = symbols.get
    } else {
      stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).map(stock => stock.stockSymbol).collect()
    }
    val total = stocks.length
    var current = 0
    stocks.foreach { stockSymbol =>
      val symbol = URLEncoder.encode(stockSymbol, "UTF-8")
      val GoogleFinanceUrl = s"https://www.google.com/finance?q=$exchangeName:$symbol&sq=%5B(exchange+%3D%3D+%22$exchangeName%22)%5D&sp=1&ei=YAr5V6qTEYPTuATt-ZfYAw"
      current = current + 1
      log.info(s"Grabbing stock info for [$current/$total] $exchangeName - $stockSymbol")
      try {
        val response = Jsoup.connect(GoogleFinanceUrl).timeout(ConnectionTimeout).ignoreContentType(true)
          .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1").execute()
        if (response.statusCode() == 200) {
          val document = response.parse()
          val currentPrice = document.oneByCss("#price-panel > div:nth-child(1) > span")
          val priceChange = document.oneByCss("#price-panel > div:nth-child(1) > div > span > span:nth-child(1)")
          val changePercentage = document.oneByCss("#price-panel > div:nth-child(1) > div > span > span:nth-child(2)")
          val time = document.oneByCss("#price-panel > div:nth-child(2) > span > span")
          val range = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(1) > tbody > tr:nth-child(1) > td.val")
          val dividendYield = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(2) > tbody > tr:nth-child(1) > td.val")
          val _52Weeks = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(1) > tbody > tr:nth-child(2) > td.val") // EPS
          val eps = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(2) > tbody > tr:nth-child(2) > td.val")
          val open = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(1) > tbody > tr:nth-child(3) > td.val")
          val shares = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(2) > tbody > tr:nth-child(3) > td.val")
          val volume = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(1) > tbody > tr:nth-child(4) > td.val")
          val beta = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(2) > tbody > tr:nth-child(4) > td.val")
          val marketCapital = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(1) > tbody > tr:nth-child(5) > td.val")
          val pe = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(1) > tbody > tr:nth-child(6) > td.val")
          val instOwn = document.oneByCss("#market-data-div > div.snap-panel-and-plusone > div.snap-panel > table:nth-child(2) > tbody > tr:nth-child(5) > td.val")

          val stockInfo = StockInfo(stockSymbol = stockSymbol, exchangeName = exchangeName,
            info52weeksFrom = numberFromArr(_52Weeks, 0).toString, info52weeksTo = numberFromArr(_52Weeks, 1).toString,
            infoBeta = numberValue(beta).toString, infoChange = numberValue(priceChange).toString, infoChangePercentage = percentageValue(changePercentage).toString,
            infoCurrentPrice = numberValue(currentPrice).toString, infoDividendYield = stringValue(dividendYield), infoEps = numberValue(eps).toString,
            infoInstOwn = percentageValue(instOwn).toString, infoMarketCapital = stringValue(marketCapital), infoOpen = numberValue(open).toString,
            infoPe = numberValue(pe).toString, infoRangeFrom = numberFromArr(range, 0).toString, infoRangeTo = numberFromArr(range, 0).toString,
            infoShares = stringValue(shares), infoTime = stringValue(time), infoVolume = stringValue(volume), DateTime.now())
          sc.parallelize(Seq(stockInfo)).saveToCassandra(Keyspace, StockInfoTable)
        }
      } catch {
        case e: Exception => {
          log.warn(s"Skipping symbol - $stockSymbol, cause: ${e.getMessage}")
          status = false
        }
      }
    }
    status
  }
}