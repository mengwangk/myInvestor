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


  // Fundamental analysis
  trait FARequest extends TradeActivity
  case class DividendAchiever(exchangeName: String, symbols: Option[Array[String]]) extends FARequest

  // Technical analysis request
  trait TARequest extends TradeActivity
  case class BollingerBand(exchangeName: String, symbols: Option[Array[String]]) extends TARequest

  // Web scraping request
  trait WebScrapingRequest extends TradeActivity
  case class ScrapStockInfo(exchangeName: String, symbols: Option[Array[String]]) extends WebScrapingRequest
  case class ScrapStockHistory(exchangeName: String, symbols: Option[Array[String]]) extends WebScrapingRequest
  case class ScrapStockDividendHistory(exchangeName: String, symbols: Option[Array[String]]) extends WebScrapingRequest
  case class ScrapStock(exchangeName: String) extends WebScrapingRequest
}
