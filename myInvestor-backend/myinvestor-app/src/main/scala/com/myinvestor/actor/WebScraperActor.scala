package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent.{ScrapStockDividendHistory, ScrapStockHistory, ScrapStockInfo, SummarizeDividendHistories}
import com.myinvestor.TradeSchema.WebScrapingResult
import com.myinvestor.scraper.google.{StockHistoryScraper, StockInfoScraper}
import com.myinvestor.scraper.yahoo.DividendHistoryScraper

import scala.concurrent.Future

/**
  * Perform web scraping
  */
class ScraperActor(settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: ScrapStockInfo => scrapStockInfo(e.exchangeName, e.symbols, sender)
    case e: ScrapStockHistory => scrapStockHistory(e.exchangeName, e.symbols, sender)
    case e: ScrapStockDividendHistory => scrapStockDividendHistory(e.exchangeName, e.symbols, sender)
  }

  def scrapStockInfo(exchangeName: String, symbols: Option[Array[String]], requester: ActorRef): Unit = {
    val scrapingResult: Future[WebScrapingResult] = Future {
      val stockInfoScraper = new StockInfoScraper(exchangeName, symbols)
      WebScrapingResult(stockInfoScraper.run)
    }
    scrapingResult pipeTo requester
  }

  def scrapStockHistory(exchangeName: String, symbols: Option[Array[String]], requester: ActorRef): Unit = {
    val scrapingResult: Future[WebScrapingResult] = Future {
      val stockHistoryScraper = new StockHistoryScraper(exchangeName, symbols)
      WebScrapingResult(stockHistoryScraper.run)
    }
    scrapingResult pipeTo requester
  }

  def scrapStockDividendHistory(exchangeName: String, symbols: Option[Array[String]], requester: ActorRef): Unit = {
    val scrapingResult: Future[WebScrapingResult] = Future {
      val dividendHistoryScraper = new DividendHistoryScraper(exchangeName, symbols)
      WebScrapingResult(dividendHistoryScraper.run)
    }
    scrapingResult pipeTo requester
  }
}
