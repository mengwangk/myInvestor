package com.myinvestor

/**
  * Trading events.
  */
object TradeEvent {

  @SerialVersionUID(1L)
  sealed trait Activity extends Serializable

  sealed trait LifeCycleEvent extends Activity
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
  trait TARequest extends Activity
  case class PerformTechnicalAnalysis(exchangeName: String, symbol: String) extends TARequest

  // Web scraping request
  trait WebScrapingRequest extends Activity
  case class ScrapStockInfo(exchangeName: String, symbol: List[String]) extends WebScrapingRequest
  case class SummarizeDividendHistory(exchangeName: String) extends WebScrapingRequest


}
