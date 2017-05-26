package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern.pipe
import com.myinvestor.AppSettings
import com.myinvestor.TradeEvent.BollingerBand
import com.myinvestor.TradeSchema.BollingerBandAnalysis

import scala.concurrent.Future

/**
  * Perform technical analysis.
  */
class TechnicalAnalysisActor(settings: AppSettings) extends ActorBase with ActorLogging {

  def receive: Actor.Receive = {
    case e: BollingerBand => bollingBandAnalysis(e.exchangeName, e.symbols, sender)
  }

  def bollingBandAnalysis(exchangeName: String, symbols: Option[Array[String]], requester: ActorRef): Unit = {
    val result: Future[BollingerBandAnalysis] = Future {
      BollingerBandAnalysis("KLSE", Some(Array("YTLPOWR")))
    }
    result pipeTo requester
  }
}
