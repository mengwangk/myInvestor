package com.myinvestor.generator

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import org.joda.time.DateTime
import org.joda.time.format.{DateTimeFormatter, ISODateTimeFormat}
import spray.json.{DefaultJsonProtocol, JsNumber, JsObject, JsString, JsValue, RootJsonFormat, deserializationError}

object TradeDataGenerator {

  case class StockDetails(exchangeName: String, stockSymbol: String, stockName: String,
                          currentPE: BigDecimal, currentPrice: BigDecimal, extractedTimestamp: DateTime)

  object JsonGeneratorProtocol extends DefaultJsonProtocol with SprayJsonSupport {

    implicit object DateTimeFormat extends RootJsonFormat[DateTime] {
      val formatter: DateTimeFormatter = ISODateTimeFormat.basicDateTimeNoMillis

      def write(obj: DateTime): JsValue = {
        JsString(formatter.print(obj))
      }

      def read(json: JsValue): DateTime = json match {
        case JsString(s) => try {
          formatter.parseDateTime(s)
        }
        catch {
          case t: Throwable => error(s)
        }
        case _ =>
          error(json.toString())
      }

      def error(v: Any): DateTime = {
        val example = formatter.print(0)
        deserializationError(f"'$v' is not a valid date value. Dates must be in compact ISO-8601 format, e.g. '$example'")
      }
    }

    /*
    implicit object StockDetailsFormat extends RootJsonFormat[StockDetails] {
      val formatter: DateTimeFormatter = ISODateTimeFormat.basicDateTimeNoMillis

      def write(stock: StockDetails) = JsObject(Map(
        "exchangeName" -> JsString(stock.exchangeName),
        "stockSymbol" -> JsString(stock.stockSymbol),
        "stockName" -> JsString(stock.stockName),
        "currentPE" -> JsNumber(stock.currentPE),
        "currentPrice" -> JsNumber(stock.currentPrice),
        "extractedTimestamp" ->  JsString(formatter.print(stock.extractedTimestamp))
      ))
      def read(value: JsValue): StockDetails = {
        null  // Not implemented
      }
    }
    */

    implicit val stockDetailsFormat: RootJsonFormat[StockDetails] = jsonFormat6(StockDetails)
  }

}
