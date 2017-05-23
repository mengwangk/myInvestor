package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent.PerformTechnicalAnalysis
import com.myinvestor.TradeSchema.MovingAverage10

import scala.concurrent.Future

/**
  * Perform technical analysis.
  */
class TechnicalAnalysisActor(settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: PerformTechnicalAnalysis => performTechnicalAnalysis(e.exchangeName, e.symbol, sender)
  }

  def performTechnicalAnalysis(exchangeName: String, symbol: String, requester: ActorRef): Unit = {
    log.info("Perform technical analysis for " + symbol)

    val result: Future[MovingAverage10] = Future {
      MovingAverage10("KLSE", "YTLPOWR")
    }
    result pipeTo requester
  }

}
