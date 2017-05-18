package com.myinvestor

import java.util.concurrent.atomic.AtomicBoolean
import akka.actor.{ActorSystem, Address, ExtendedActorSystem, Extension, ExtensionId, ExtensionIdProvider, Props}
import akka.cluster.Cluster
import scala.concurrent.{Await, Future}

/**
  * Main application to start Kafka, ZooKeeper, Akka.
  *
  * Can be run with sbt: sbt app/run
  */
object MyInvestorApp extends App {
  val settings = new AppSettings

  import settings._

  // Create the Actor system
  val system = ActorSystem(AppName)
  val myInvestor = MyInvestor(system)
}

object MyInvestor extends ExtensionId[MyInvestor] with ExtensionIdProvider {
  override def lookup: ExtensionId[_ <: Extension] = MyInvestor
  override def createExtension(system: ExtendedActorSystem) = new MyInvestor(system)
}

class MyInvestor(system: ExtendedActorSystem) extends Extension {

  val settings = new AppSettings

  import TradeEvent.GracefulShutdown
  import settings._
  import system.dispatcher

  val nodeGuardianActorName = "node-guardian"

  system.registerOnTermination(shutdown())

  protected val log = akka.event.Logging(system, system.name)
  protected val running = new AtomicBoolean(false)
  protected val terminated = new AtomicBoolean(false)

  implicit private val timeout = system.settings.CreationTimeout

  // Configure Kafka
  val kafkaParams: Map[String, Object] = Map[String, Object](
    "bootstrap.servers" -> KafkaHosts,
    "key.deserializer" -> Class.forName(KafkaDeserializerFqcn),
    "value.deserializer" -> Class.forName(KafkaDeserializerFqcn),
    "group.id" -> KafkaGroupId,
    "auto.offset.reset" -> KafkaAutoOffsetReset,
    "enable.auto.commit" -> (KafkaEnableAutoCommit: java.lang.Boolean)
  )
  // The root supervisor and traffic controller of the app. All inbound messages go through this actor
  private val guardian = system.actorOf(Props(new NodeGuardian(kafkaParams, settings)), nodeGuardianActorName)

  private val cluster = Cluster(system)

  val selfAddress: Address = cluster.selfAddress

  cluster.joinSeedNodes(Vector(selfAddress))

  def isRunning: Boolean = running.get

  def isTerminated: Boolean = terminated.get

  private def shutdown(): Unit = if (!isTerminated) {
    import akka.pattern.ask

    if (terminated.compareAndSet(false, true)) {
      log.info("Node {} shutting down", selfAddress)
      cluster leave selfAddress
      SparkContextUtils.stopStreaminContext()
      (guardian ? GracefulShutdown).mapTo[Future[Boolean]]
        .onComplete { _ =>
          system.terminate()
          Await.ready(system.whenTerminated, timeout.duration)
        }
    }
  }
}