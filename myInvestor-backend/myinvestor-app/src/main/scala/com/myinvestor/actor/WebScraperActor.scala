package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent._
import com.myinvestor.TradeSchema.WebScrapingResult
import com.myinvestor.scraper.google.{StockHistoryScraper, StockScraper}
import com.myinvestor.scraper.yahoo.{DividendHistoryScraper, G2YStockMapper, G2YStockMapperByName, StockInfoScraper2}

import scala.concurrent.Future

/**
  * Perform web scraping
  */
class WebScraperActor(settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: ScrapStockInfo => scrapStockInfo(e.exchangeName, e.symbols, sender)
    case e: ScrapStockHistory => scrapStockHistory(e.exchangeName, e.symbols, sender)
    case e: ScrapStockDividendHistory => scrapStockDividendHistory(e.exchangeName, e.symbols, sender)
    case e: ScrapStock => scrapStock(e.exchangeName, sender)
    case e: ScrapStockMapping => scrapStockMapping(e.exchangeName, sender)
  }

  def scrapStockInfo(exchangeName: String, symbols: Option[Array[String]], requester: ActorRef): Unit = {
    val scrapingResult: Future[WebScrapingResult] = Future {
      //val stockInfoScraper = new StockInfoScraper(exchangeName, symbols) // Scrap from Google
      val stockInfoScraper = new StockInfoScraper2(exchangeName, symbols) // Scrap from Yahoo
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

  def scrapStock(exchangeName: String, requester: ActorRef): Unit = {
    val scrapingResult: Future[WebScrapingResult] = Future {
      val stockScraper = new StockScraper(exchangeName)
      WebScrapingResult(stockScraper.run)
    }
    scrapingResult pipeTo requester
  }

  def scrapStockMapping(exchangeName: String, requester: ActorRef): Unit = {
    val scrapingResult: Future[WebScrapingResult] = Future {
      val stockScraper = new G2YStockMapperByName(exchangeName)
      stockScraper.purge
      if (stockScraper.run) {
        val stockScraper = new G2YStockMapper(exchangeName)
        WebScrapingResult(stockScraper.run)
      } else {
        WebScrapingResult(false)
      }
    }
    scrapingResult pipeTo requester
  }

}
