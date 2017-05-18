package com.myinvestor

import akka.japi.Util.immutableSeq
import com.datastax.spark.connector.cql.{AuthConf, NoAuthConf, PasswordAuthConf}
import com.typesafe.config.{Config, ConfigFactory}

import scala.util.Try

/**
  * Client configuration settings
  */
final class ClientSettings(conf: Option[Config] = None) extends Serializable {

  // val localAddress: String = InetAddress.getLocalHost.getHostAddress
  val localAddress: String = "localhost"

  val rootConfig: Config = conf match {
    case Some(c) => c.withFallback(ConfigFactory.load())
    case _ => ConfigFactory.load
  }

  protected val kafka: Config = rootConfig.getConfig("kafka")
  protected val cassandra: Config = rootConfig.getConfig("cassandra")
  protected val myInvestor: Config = rootConfig.getConfig("myInvestor")
  protected val spark: Config = rootConfig.getConfig("spark")

  // Application settings
  val AppName: String = myInvestor.getString("app-name")

  val BasePort: Int = 2551

  val KafkaHosts: Set[String] = immutableSeq(kafka.getStringList("hosts")).toSet
  val KafkaTopicExchange: String = kafka.getString("topic.exchange")
  val KafkaTopicStock: String = kafka.getString("topic.stock")
  val KafkaTopicStockHistory: String = kafka.getString("topic.stock_history")
  val KafkaTopicStockInfo: String = kafka.getString("topic.stock_info")
  val KafkaKey: String = kafka.getString("group.id")
  val KafkaBatchSendSize: Int = kafka.getInt("batch.send.size")

  val HttpHostName: String = myInvestor.getString("http.host")
  val HttpListenPort: Int = myInvestor.getInt("http.port")

  // Spark settings

  val SparkMaster: String = withFallback[String](Try(spark.getString("master")), "spark.master") getOrElse "local[*]"

  val SparkCleanerTtl: Int = withFallback[Int](Try(spark.getInt("cleaner.ttl")), "spark.cleaner.ttl") getOrElse (3600 * 2)

  // val SparkStreamingBatchInterval: Long = withFallback[Long](Try(spark.getInt("streaming.batch.interval")), "spark.streaming.batch.interval") getOrElse 1000

  val SparkCheckpointDir: String = spark.getString("spark.checkpoint.dir")

  // Cassandra settings
  val CassandraHosts: String = withFallback[String](Try(cassandra.getString("connection.host")), "spark.cassandra.connection.host") getOrElse localAddress

  val CassandraAuthUsername: Option[String] = Try(cassandra.getString("auth.username")).toOption.orElse(sys.props.get("spark.cassandra.auth.username"))

  val CassandraAuthPassword: Option[String] = Try(cassandra.getString("auth.password")).toOption.orElse(sys.props.get("spark.cassandra.auth.password"))

  val CassandraAuth: AuthConf = {
    val credentials = for (
      username <- CassandraAuthUsername;
      password <- CassandraAuthPassword
    ) yield (username, password)

    credentials match {
      case Some((user, password)) => PasswordAuthConf(user, password)
      case None => NoAuthConf
    }
  }

  /**
    * Attempts to acquire from environment, then java system properties.
    *
    * @param env Emvironment
    * @param key Key
    * @tparam T Value
    * @return
    */
  def withFallback[T](env: Try[T], key: String): Option[T] = env match {
    case null => None
    case value => value.toOption
  }
}
