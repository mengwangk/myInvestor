package com.myinvestor.generator

import java.io.{BufferedWriter, FileWriter}

import akka.actor.ActorSystem
import com.datastax.spark.connector._
import com.myinvestor.TradeHelper.JsonApiProtocol
import com.myinvestor.generator.TradeDataGenerator.JsonGeneratorProtocol._
import com.myinvestor.generator.TradeDataGenerator.{Message, StockDetails}
import com.myinvestor.{AppSettings, SparkContextUtils, TradeSchema}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext
import org.joda.time.DateTime
import spray.can.Http
import spray.client.pipelining._
import spray.http.{HttpRequest, HttpResponse}
import spray.httpx.SprayJsonSupport
import spray.json.{AdditionalFormats, _}

import scala.collection.mutable.ArrayBuffer
import scala.concurrent.duration._
import scala.concurrent.{Await, Future}
import scala.util.Try


/**
  * Generate JSON file for all stocks under a exchange, and also HTTP POST
  * the info the the server.
  *
  * E.g. for NASDAQ the generated file is named NASDAQ.json
  *
  * <p>
  *
  * @see https://github.com/spray/spray/blob/master/examples/spray-client/simple-spray-client/src/main/scala/spray/examples/Main.scala
  *
  *      </p>
  *
  */
class StockDataGenerator(val exchangeName: String) extends JsonApiProtocol with SprayJsonSupport with AdditionalFormats {

  def run(): Boolean = {
    var status = true
    val log = Logger(this.getClass.getName)
    import TradeSchema._
    val settings = new AppSettings

    // https://stackoverflow.com/questions/36386016/spray-json-cannot-find-jsonwriter-or-jsonformat-type-class-for
    // implicit val message = messageFormat
    val sc: SparkContext = SparkContextUtils.sparkContext

    // Generate market.json
    /*
    log.info("Generating market file")
    var exchanges = sc.cassandraTable[Exchange](Keyspace, ExchangeTable).collect()
    val exchangeFile = settings.DataGeneratorOutput + "market.json"
    writeFile(exchangeFile, exchanges.toJson.toString)
    */


    /*
    val stocks = sc.cassandraTable[Stock](Keyspace, StockTable).where(ExchangeNameColumn + " = ?", exchangeName).collect()
    val total = stocks.length
    var current = 0
    var stockArray = ArrayBuffer[StockDetails]()
    stocks.foreach { stock =>
      current = current + 1
      log.info(s"Procesing stock info for [$current/$total] $exchangeName  - ${stock.stockSymbol}")
      val stockInfos = sc.cassandraTable[StockInfo](Keyspace, StockInfoTable).where(ExchangeNameColumn + " = ? AND " + StockSymbolColumn + " = ?",
        exchangeName, stock.stockSymbol).collect()
      if (stockInfos.length > 0) {
        val stockDetails = StockDetails(exchangeName = exchangeName, stockSymbol = stock.stockSymbol,
          stockName = stock.stockName, currentPE = stockInfos.head.infoPe, currentPrice = stockInfos.head.infoCurrentPrice,
          extractedTimestamp = stockInfos.head.infoExtractedTimestamp)
        stockArray.append(stockDetails)
      } else {
        val stockDetails = StockDetails(exchangeName = exchangeName, stockSymbol = stock.stockSymbol,
          stockName = stock.stockName, currentPE = 0, currentPrice = 0,
          extractedTimestamp = DateTime.now())
        stockArray.append(stockDetails)
      }
    }

    // Generate Stock JSON file
    val stockFile = settings.DataGeneratorOutput + exchangeName + ".json"
    log.info(s"Generating $stockFile")
    writeFile(stockFile, stockArray.toList.toJson.toString)


    // Generate stock mapping file
    log.info("Generating stock mapping file")
    var mappedStocks = sc.cassandraTable[G2YFinanceMapping](Keyspace, G2YFinanceMappingTable).where(GoogleExchangeNameColumn + " = ?", exchangeName).collect()
    val mapperFile = settings.DataGeneratorOutput + exchangeName + "_mapper.json"
    writeFile(mapperFile, mappedStocks.toJson.toString)

    */


    // Generate dividend history file
    log.info("Generating stock dividend file")
    var dividends = sc.cassandraTable[DividendSummary](Keyspace, DividendSummaryTable).where(GoogleExchangeNameColumn + " = ?", exchangeName).collect()
    val dividendFile = settings.DataGeneratorOutput + exchangeName + "_dividend.json"
    writeFile(dividendFile, dividends.toJson.toString)



    /** Commented for now Sept 17 2017
    // Send to server
    import scala.concurrent.ExecutionContext.Implicits.global
    implicit val system = ActorSystem()
    val pipeline: HttpRequest => Future[HttpResponse] = sendReceive
    //httpPost(settings.AppServerUrl + "/investor/v1/stock", stockArray.toList.toJson.toString)
    httpPost(pipeline, settings.AppServerUrl + "/investor/v1/mapping", mappedStocks.toJson.toString)
    httpPost(pipeline, settings.AppServerUrl + "/investor/v1/dividend", dividends.toJson.toString)
    */
    status

  }

  def writeFile(fileName: String, content: String): Unit = {
    val stockFile: Try[BufferedWriter] = Try {
      new BufferedWriter(new FileWriter(fileName))
    }
    try {
      if (stockFile.isSuccess) {
        stockFile.get.write(content)
      }
    } finally {
      stockFile.get.flush()
      stockFile.get.close()
    }
  }

  def httpPost(pipeline: HttpRequest => Future[HttpResponse], url: String, content: String): Future[HttpResponse] = {
    // Post to server - https://stackoverflow.com/questions/18623356/sending-post-with-json-using-spray
    // https://stackoverflow.com/questions/20443826/scala-spray-client-define-implicits-for-akka-actorreffactory
    // https://stackoverflow.com/questions/33304047/cannot-find-an-implicit-executioncontext-you-might-pass-spray-scala
    // http://spray.io/documentation/1.2.4/spray-client/#usage
    val message = Message(content)
    val response: Future[HttpResponse] = pipeline(Post(url, message))
    response
  }
}




