package com.myinvestor

/**
  * Trading events.
  */
object TradeEvent {

  @SerialVersionUID(1L)
  sealed trait TradeActivity extends Serializable

  sealed trait LifeCycleEvent extends TradeActivity
  case object OutputStreamInitialized extends LifeCycleEvent
  case object NodeInitialized extends LifeCycleEvent
  case object Start extends LifeCycleEvent
  case object DataFeedStarted extends LifeCycleEvent
  case object Shutdown extends LifeCycleEvent
  case object TaskCompleted extends LifeCycleEvent

  sealed trait Task extends Serializable
  case object QueryTask extends Task
  case object GracefulShutdown extends LifeCycleEvent


  // Technical analysis request
  trait TechnicalAnalysis extends TradeActivity
  case class PerformTechnicalAnalysis(exchangeName: String, symbol: String) extends TechnicalAnalysis

  // Web scraping request
  trait WebScrapingRequest extends TradeActivity
  case class ScrapStockInfo(exchangeName: String, symbols: Array[String]) extends WebScrapingRequest
  case class SummarizeDividendHistories(exchangeName: String) extends WebScrapingRequest


}
