package com.myinvestor

import akka.actor.{Actor, ActorLogging, ActorSystem, Cancellable, PoisonPill, Props}
import akka.cluster.Cluster
import com.myinvestor.TradeEvent.{PerformTechnicalAnalysis, QueryTask}
import com.myinvestor.TradeSchema.{TradeAnalysis, TradeModel}
import com.myinvestor.cluster.ClusterAwareNodeGuardian
import com.typesafe.config.ConfigFactory

import scala.concurrent.duration._

/**
  * myInvestor client app.
  */
object MyInvestorClientApp extends App {

  val settings = new ClientSettings
  import settings._

  // Creates the ActorSystem.
  val system = ActorSystem(AppName, ConfigFactory.parseString("akka.remote.netty.tcp.port = 2552"))

  // The root supervisor and fault tolerance handler of the data ingestion nodes.
  val guardian = system.actorOf(Props[ApiNodeGuardian], "node-guardian")

  system.registerOnTermination {
    guardian ! PoisonPill
  }
}

/**
  * API node guardian.
  */
final class ApiNodeGuardian extends ClusterAwareNodeGuardian {

  import context.dispatcher
  import TradeEvent._

  val api = context.actorOf(Props[AutomatedApiActor], "automated-api")

  var task: Option[Cancellable] = None

  override def preStart(): Unit = {
    super.preStart()
    cluster.joinSeedNodes(Vector(cluster.selfAddress))
  }

  Cluster(context.system).registerOnMemberUp {
    // Schedule every 2 seconds
    task = Some(context.system.scheduler.schedule(Duration.Zero, 2.seconds) {
      log.info("Sending request")
      api ! QueryTask
    })
  }

  override def postStop(): Unit = {
    task.map(_.cancel())
    super.postStop()
  }

  def initialized: Actor.Receive = {
    case e =>
  }
}

private[myinvestor] class AutomatedApiActor extends Actor with ActorLogging {

  val settings = new ClientSettings

  import settings._

  val guardian = context.actorSelection(Cluster(context.system).selfAddress.copy(port = Some(BasePort)) + "/user/node-guardian")
  //val guardian = context.actorSelection("akka.tcp://myInvestor@localhost:2551/user/node-guardian")

  override def preStart(): Unit = log.info("Starting...")

  def receive: Actor.Receive = {
    case e: TradeAnalysis =>
      log.debug("Received {} from {}", e, sender)
    case e: TradeModel =>
      log.debug("Received {} from {}", e, sender)
    case QueryTask => queries()
  }

  def queries(): Unit = {
    guardian ! PerformTechnicalAnalysis("KLSE", "YTLPOWR")
  }
}
