package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent.{ScrapStockInfo, SummarizeDividendHistories}
import com.myinvestor.TradeSchema.MovingAverage10

import scala.concurrent.Future

/**
  * Perform web scraping
  */
class WebScraperActor (settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: ScrapStockInfo => scrapStockInfo(e.exchangeName, e.symbols, sender)
    case e: SummarizeDividendHistories => summarizeDividendHistories(e.exchangeName, sender)
  }

  def scrapStockInfo(exchangeName: String, symbols: List[String], requester: ActorRef): Unit = {

    val sma: Future[MovingAverage10] = Future {
      MovingAverage10("KLSE", "YTLPOWR")
    }
    sma pipeTo requester
  }

  def summarizeDividendHistories(exchangeName: String, requester: ActorRef): Unit = {

    val sma: Future[MovingAverage10] = Future {
      MovingAverage10("KLSE", "YTLPOWR")
    }
    sma pipeTo requester
  }

}
