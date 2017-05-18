package com.myinvestor.actor

import java.util.concurrent.TimeoutException

import akka.actor.SupervisorStrategy._
import akka.actor._
import akka.util.Timeout

import scala.concurrent.duration._

/**
  * Base actor for data computation.
  */
private[myinvestor] trait ActorBase extends Actor {

  implicit val timeout = Timeout(5.seconds)

  implicit val ctx = context.dispatcher

  override val supervisorStrategy =
    OneForOneStrategy(maxNrOfRetries = 10, withinTimeRange = 1.minute) {
      case _: ActorInitializationException => Stop
      case _: IllegalArgumentException => Stop
      case _: IllegalStateException => Restart
      case _: TimeoutException => Escalate
      case _: Exception => Escalate
    }
}

