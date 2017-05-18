package com.myinvestor

/**
  * Trading events.
  */
object TradeEvent {

  @SerialVersionUID(1L)
  sealed trait TradeEvent extends Serializable

  sealed trait LifeCycleEvent extends TradeEvent
  case object OutputStreamInitialized extends LifeCycleEvent
  case object NodeInitialized extends LifeCycleEvent
  case object Start extends LifeCycleEvent
  case object DataFeedStarted extends LifeCycleEvent
  case object Shutdown extends LifeCycleEvent
  case object TaskCompleted extends LifeCycleEvent

  sealed trait Task extends Serializable
  case object QueryTask extends Task
  case object GracefulShutdown extends LifeCycleEvent


  // Trading related request
  sealed trait TradeRequest extends TradeEvent

  // Technical analysis request
  trait TechnicalAnalysisRequest extends TradeRequest
  case class PerformTechnicalAnalysis(exchangeName: String, symbol: String) extends TechnicalAnalysisRequest

}
