package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent.GenerateStockData
import com.myinvestor.TradeSchema.DataGeneratorResult
import com.myinvestor.generator.StockDataGenerator

import scala.concurrent.Future

class StockDataGeneratorActor (settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: GenerateStockData => generateStockData(e.exchangeName, sender)
  }

  def generateStockData(exchangeName: String, requester: ActorRef): Unit = {
    val result: Future[DataGeneratorResult] = Future {
      val generator = new StockDataGenerator(exchangeName)
      DataGeneratorResult(generator.run)
    }
    result pipeTo requester
  }
}