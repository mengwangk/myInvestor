package com.myinvestor

import java.util.{Properties, UUID}

import akka.Done
import akka.actor.{Actor, ActorLogging, ActorRef, ActorSystem, PoisonPill, Props}
import akka.event.slf4j.Logger
import akka.http.scaladsl.Http
import akka.http.scaladsl.Http.ServerBinding
import akka.http.scaladsl.model.{HttpEntity, _}
import akka.http.scaladsl.server.Directives
import akka.routing.BalancingPool
import akka.stream.{ActorMaterializer, ActorMaterializerSettings}
import akka.util.Timeout
import com.myinvestor.KafkaEvent.KafkaMessageEnvelope
import com.myinvestor.TradeHelper.JsonApiProtocol
import com.myinvestor.cluster.ClusterAwareNodeGuardian
import com.typesafe.config.ConfigFactory
import org.apache.kafka.common.serialization.StringSerializer
import spray.json._

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}


/**
  * Run with: sbt clients/run for automatic data file import to Kafka.
  *
  */
object KafkaDataIngestionApp extends App {
  // Creates the ActorSystem.
  val system = ActorSystem("myInvestor", ConfigFactory.parseString("akka.remote.netty.tcp.port = 2551"))

  // The root supervisor and fault tolerance handler of the data ingestion nodes.
  val guardian = system.actorOf(Props[HttpNodeGuardian], "node-guardian")

  system.registerOnTermination {
    guardian ! PoisonPill
  }
}

/**
  * Ingest data from web.
  */
final class HttpNodeGuardian extends ClusterAwareNodeGuardian {
  val actorName = "kafka-ingestion-router"
  val settings = new ClientSettings

  import settings._

  cluster.joinSeedNodes(Vector(cluster.selfAddress))

  // The [[KafkaPublisherActor]] as a load-balancing pool router
  // which sends messages to idle or less busy routees to handle work.
  val router: ActorRef = context.actorOf(BalancingPool(5).props(Props(new KafkaPublisherActor(KafkaHosts, KafkaBatchSendSize))), actorName)

  // Wait for this node's [[MemberStatus]] to be
  // [[MemberUp]] before starting work, which means
  // it's membership in the [[Cluster]] node ring has been gossipped, and we
  // can leverage the cluster's adaptive load balancing which will route data
  // to the `MyInvestorApp` nodes based on most healthy, by their health metrics
  // - cpu, system load average and heap.
  cluster registerOnMemberUp {
    // As http data is received, publishes to Kafka.
    context.actorOf(BalancingPool(1).props(Props(new HttpDataFeedActor(router))), "dynamic-data-feed")
    log.info("Started data ingestion on {}.", cluster.selfAddress)
  }

  def initialized: Actor.Receive = {
    case TradeEvent.TaskCompleted => // ignore for now
  }
}

/**
  * The KafkaPublisherActor receives initial data on startup
  * (because this is for a runnable demo) and also receives data in runtime.
  *
  */
class KafkaPublisherActor(val config: Properties) extends KafkaDataProducerActor[String, String] {
  def this(hosts: Set[String], batchSize: Int) = this(KafkaDataProducer.createConfig(hosts, batchSize, classOf[StringSerializer].getName))
}

class HttpDataFeedService(kafka: ActorRef) extends Directives with JsonApiProtocol {
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
        complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, "<html><head><title>HTTP data feed</title></head<body><h1>HTTP data feed</h1></body></html>"))
      }
    } ~
      post {
        path("exchange") {
          entity(as[Exchange]) { exchange =>
            val identifier = UUIDVersion4
            val saved: Future[Done] = produceMessage(identifier, KafkaTopicExchange, exchange.toJson.compactPrint)
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
            val saved: Future[Done] = produceMessage(identifier, KafkaTopicStock, stock.toJson.compactPrint)
            onComplete(saved) { done =>
              complete(HttpEntity(ContentTypes.`application/json`, formatResponse(identifier)))
            }
          }
        }
      } ~
      post {
        path("stockhistory") {
          entity(as[StockHistory]) { stockHistory =>
            val identifier = UUIDVersion4
            val saved: Future[Done] = produceMessage(identifier, KafkaTopicStockHistory, stockHistory.toJson.compactPrint)
            onComplete(saved) { done =>
              complete(HttpEntity(ContentTypes.`application/json`, formatResponse(identifier)))
            }
          }
        }
      } ~
      post {
        path("stockinfo") {
          entity(as[StockInfo2]) { stockInfo =>
            val identifier = UUIDVersion4
            val saved: Future[Done] = produceMessage(identifier, KafkaTopicStockInfo, stockInfo.toJson.compactPrint)
            onComplete(saved) { done =>
              complete(HttpEntity(ContentTypes.`application/json`, formatResponse(identifier)))
            }
          }
        }
      }

  def produceMessage(identifier: UUID, topic: String, message: String): Future[Done] = {
    val future: Future[Done] = Future {
      // Log the request to Cassandra
      SparkContextUtils.saveRequest(Request(identifier, false, ""))
      kafka ! KafkaMessageEnvelope[String, String](identifier.toString, topic, KafkaKey, message)
      log.info("Message received [" + message + "]")
      Done
    }
    future
  }
}

class HttpDataFeedActor(kafka: ActorRef) extends Actor with ActorLogging {
  val settings = new ClientSettings

  import settings._

  implicit val system: ActorSystem = context.system
  implicit val askTimeout: Timeout = 500.millis
  implicit val materializer = ActorMaterializer(ActorMaterializerSettings(system))
  implicit val executionContext: ExecutionContextExecutor = system.dispatcher

  val service = new HttpDataFeedService(kafka)

  val bindingFuture: Future[ServerBinding] = Http().bindAndHandle(service.route, HttpHostName, HttpListenPort)

  override def postStop: Unit = {
    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done
  }

  def receive: Actor.Receive = {
    case e =>
  }
}



