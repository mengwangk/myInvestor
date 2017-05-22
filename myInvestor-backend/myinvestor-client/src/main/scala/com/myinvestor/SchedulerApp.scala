package com.myinvestor

import java.util.UUID

import akka.Done
import akka.actor.{Actor, ActorLogging, ActorRef, ActorSelection, ActorSystem, PoisonPill, Props}
import akka.cluster.Cluster
import akka.event.slf4j.Logger
import akka.http.scaladsl.Http
import akka.http.scaladsl.Http.ServerBinding
import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import akka.http.scaladsl.server.Directives
import akka.routing.BalancingPool
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}
import akka.util.Timeout
import com.myinvestor.TradeEvent.{PerformTechnicalAnalysis, QueryTask}
import com.myinvestor.TradeHelper.JsonApiProtocol
import com.myinvestor.TradeSchema.{Analysis, ObjectModel}
import com.myinvestor.cluster.ClusterAwareNodeGuardian
import com.typesafe.config.ConfigFactory

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}
/**
  * Scheduler app to run tasks/jobs.
  */
object SchedulerApp  extends App {

  val settings = new ClientSettings
  import settings._

  // Creates the ActorSystem - ** app, client must use the same AppName
  val system = ActorSystem(AppName, ConfigFactory.parseString("akka.remote.netty.tcp.port = 2552"))

  // The root supervisor and fault tolerance handler of the data ingestion nodes.
  val guardian = system.actorOf(Props[SchedulerNodeGuardian], "scheduler-node-guardian")

  system.registerOnTermination {
    guardian ! PoisonPill
  }
}

/**
  * Scheduler node guardian
  */
final class SchedulerNodeGuardian extends ClusterAwareNodeGuardian {
  val actorName = "scheduler-node-guardian"
  val settings = new ClientSettings

  cluster.joinSeedNodes(Vector(cluster.selfAddress))
  cluster registerOnMemberUp {

    // As http data is received, publishes to Kafka.
    context.actorOf(BalancingPool(1).props(Props(new SchedulerServiceActor())), "scheduled-service-actor")

    log.info("Started scheduler service {}.", cluster.selfAddress)
  }

  def initialized: Actor.Receive = {
    case TradeEvent.TaskCompleted => // ignore for now
  }
}

class SchedulerServiceActor extends Actor with ActorLogging {
  val settings = new ClientSettings
  import settings._

  implicit val system: ActorSystem = context.system
  implicit val askTimeout: Timeout = 500.millis
  implicit val materializer = ActorMaterializer(ActorMaterializerSettings(system))
  implicit val executionContext: ExecutionContextExecutor = system.dispatcher

  val nodeGuardian: ActorSelection = context.actorSelection(Cluster(context.system).selfAddress.copy(port = Some(BasePort)) + "/user/node-guardian")

  val service = new SchedulerService(nodeGuardian)
  val bindingFuture: Future[ServerBinding] = Http().bindAndHandle(service.route, HttpHostName, HttpListenPort)

  override def preStart(): Unit =  {
  }

  override def postStop: Unit = {
    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done
  }

  def receive: Actor.Receive = {
    case e: Analysis =>
      log.debug("Received {} from {}", e, sender)
    case e: ObjectModel =>
      log.debug("Received {} from {}", e, sender)
    case QueryTask => queries()
    case e =>
  }

  def queries(): Unit = {
    nodeGuardian ! PerformTechnicalAnalysis("KLSE", "YTLPOWR")
  }
}

class SchedulerService(nodeGuardian: ActorSelection) extends Directives with JsonApiProtocol {
  val settings = new ClientSettings
  val log = Logger(this.getClass.getName)

  import com.myinvestor.TradeHelper._
  import com.myinvestor.TradeSchema._
  import settings._

  import ExecutionContext.Implicits.global

  def formatResponse(identifier: UUID): String = {
    val requestId = identifier.toString
    s"""{
       |"id":"$requestId"
       |}
          """.stripMargin
  }

  val route =
    get {
      path("") {
        nodeGuardian ! PerformTechnicalAnalysis("KLSE", "YTLPOWR")
        complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, "<html><head><title>Job scheduler</title></head<body><h1>Job scheduler</h1></body></html>"))
      }
    }
    /*
    ~
      post {
        path("exchange") {
          entity(as[Exchange]) { exchange =>
            val identifier = UUIDVersion4
            //val saved: Future[Done] = produceMessage(identifier, KafkaTopicExchange, exchange.toJson.compactPrint)
            onComplete(saved) { done =>
              complete(HttpEntity(ContentTypes.`application/json`, formatResponse(identifier)))
            }
          }
        }
      } ~
      post {
        path("stock") {
          entity(as[Stock]) { stock =>
            val identifier = UUIDVersion4
            //val saved: Future[Done] = produceMessage(identifier, KafkaTopicStock, stock.toJson.compactPrint)
            onComplete(saved) { done =>
              complete(HttpEntity(ContentTypes.`application/json`, formatResponse(identifier)))
            }
          }
        }
      }
      */
}


