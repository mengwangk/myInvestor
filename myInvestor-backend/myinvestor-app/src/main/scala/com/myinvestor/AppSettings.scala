package com.myinvestor

import com.datastax.spark.connector.cql.{AuthConf, NoAuthConf, PasswordAuthConf}
import com.typesafe.config.{Config, ConfigFactory}

import scala.util.Try

/**
  * Application settings. First attempts to acquire from the deploy environment.
  * If not exists, then from -D java system properties, else a default config.
  *
  * Settings in the environment such as: SPARK_HA_MASTER=local[10] is picked up first.
  *
  * Settings from the command line in -D will override settings in the deploy environment.
  * For example: sbt -Dspark.master="local[12]" run
  *
  * If you have not yet used Typesafe Config before, you can pass in overrides like so:
  *
  * {{{
  *   new Settings(ConfigFactory.parseString("""
  *      spark.master = "some.ip"
  *   """))
  * }}}
  *
  * Any of these can also be overriden by your own reference.conf.
  *
  * @param conf Optional config for test
  */
final class AppSettings(conf: Option[Config] = None) extends Serializable {

  // val localAddress: String = InetAddress.getLocalHost.getHostAddress
  val localAddress: String = "localhost"

  val rootConfig: Config = conf match {
    case Some(c) => c.withFallback(ConfigFactory.load())
    case _ => ConfigFactory.load
  }

  protected val spark: Config = rootConfig.getConfig("spark")
  protected val cassandra: Config = rootConfig.getConfig("cassandra")
  protected val kafka: Config = rootConfig.getConfig("kafka")
  protected val myInvestor: Config = rootConfig.getConfig("myInvestor")


  // Spark settings

  val SparkMaster: String = withFallback[String](Try(spark.getString("master")), "spark.master") getOrElse "local[*]"

  val SparkCleanerTtl: Int = withFallback[Int](Try(spark.getInt("cleaner.ttl")), "spark.cleaner.ttl") getOrElse (3600 * 2)

  val SparkStreamingBatchInterval: Long = withFallback[Long](Try(spark.getInt("streaming.batch.interval")), "spark.streaming.batch.interval") getOrElse 1000

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

  // Kafka settings
  val KafkaHosts: String = withFallback[String](Try(kafka.getString("hosts")), "kafka.hosts") getOrElse "localhost:9092"
  val KafkaGroupId: String = kafka.getString("group.id")
  val KafkaTopicExchange: String = kafka.getString("topic.exchange")
  val KafkaTopicStock: String = kafka.getString("topic.stock")
  val KafkaTopicStockHistory: String = kafka.getString("topic.stock_history")
  val KafkaTopicStockInfo: String = kafka.getString("topic.stock_info")
  val KafkaDeserializerFqcn: String = kafka.getString("deserializer.fqcn")
  val KafkaAutoOffsetReset: String = kafka.getString("auto-offset-reset")
  val KafkaEnableAutoCommit: Boolean = kafka.getBoolean("enable.auto.commit")

  // Application settings
  val AppName: String = myInvestor.getString("app-name")

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
