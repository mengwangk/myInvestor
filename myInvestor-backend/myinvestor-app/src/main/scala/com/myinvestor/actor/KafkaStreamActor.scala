package com.myinvestor.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import com.datastax.spark.connector.streaming._
import com.myinvestor.TradeHelper.JsonApiSupport._
import com.myinvestor.TradeEvent.OutputStreamInitialized
import com.myinvestor.TradeSchema._
import com.myinvestor.{AppSettings, SparkContextUtils}
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.spark.streaming.dstream.InputDStream
import org.apache.spark.streaming.kafka010.ConsumerStrategies.Subscribe
import org.apache.spark.streaming.kafka010.LocationStrategies.PreferConsistent
import org.apache.spark.streaming.kafka010._
import spray.json._


object KafkaFilter {
  val settings = new AppSettings()
  import settings._

  def filterExchange(record: ConsumerRecord[String, String]): Boolean = {
    record.topic() == KafkaTopicExchange
  }

  def filterStock(record: ConsumerRecord[String, String]): Boolean = {
    record.topic() == KafkaTopicStock
  }

  def filterStockHistory(record: ConsumerRecord[String, String]): Boolean = {
    record.topic() == KafkaTopicStockHistory
  }

  def filterStockInfo(record: ConsumerRecord[String, String]): Boolean = {
    record.topic() == KafkaTopicStockInfo
  }
}

/**
  * The KafkaStreamActor creates a streaming pipeline from Kafka to Cassandra via Spark.
  * It creates the Kafka stream which streams the source data, transforms it, to
  * a column entry for a specific stock trading, and saves the new data
  * to the cassandra table as it arrives.
  */
class KafkaStreamActor(kafkaParams: Map[String, Object],
                       settings: AppSettings,
                       listener: ActorRef) extends ActorBase with ActorLogging {

  import settings._

  val topics = Array(KafkaTopicExchange, KafkaTopicStock, KafkaTopicStockHistory, KafkaTopicStockInfo)
  val kafkaStream: InputDStream[ConsumerRecord[String, String]] = KafkaUtils.createDirectStream[String, String](SparkContextUtils.streamingContext, PreferConsistent, Subscribe[String, String](topics, kafkaParams))

  // Save to Exchange table
  kafkaStream.filter(KafkaFilter.filterExchange(_)).map(_.value.parseJson).map(_.convertTo[Exchange]).saveToCassandra(Keyspace, ExchangeTable)

  // Save to Stock table
  kafkaStream.filter(KafkaFilter.filterStock(_)).map(_.value.parseJson).map(_.convertTo[Stock]).saveToCassandra(Keyspace, StockTable)

  // Save to Stock_History table
  kafkaStream.filter(KafkaFilter.filterStockHistory(_)).map(_.value.parseJson).map(_.convertTo[StockHistory]).saveToCassandra(Keyspace, StockHistoryTable)

  // Save to Stock_Info table
  kafkaStream.filter(KafkaFilter.filterStockInfo(_)).map(_.value.parseJson).map(_.convertTo[StockInfo]).saveToCassandra(Keyspace, StockInfoTable)

  // Notifies the supervisor that the Spark Streams have been created and defined.
  // Now the [[StreamingContext]] can be started.
  listener ! OutputStreamInitialized

  def receive: Actor.Receive = {
    case e => // ignore
  }
}
