package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent.DividendAchiever
import com.myinvestor.TradeSchema.DividendAchieverAnalysis
import com.myinvestor.fundamental.DividendSummarizer
import com.myinvestor.scraper.google.StockHistoryScraper

import scala.concurrent.Future

/**
  * Fundamental analysis actor.
  */
class FundamentalAnalysisActor(settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: DividendAchiever => dividendAchieverAnalysis(e.exchangeName, e.symbols, sender)
  }

  def dividendAchieverAnalysis(exchangeName: String, symbols: Option[Array[String]], requester: ActorRef): Unit = {
    val result: Future[DividendAchieverAnalysis] = Future {
      val summarizer = new DividendSummarizer(exchangeName, symbols)
      DividendAchieverAnalysis(summarizer.run)
    }
    result pipeTo requester
  }
}