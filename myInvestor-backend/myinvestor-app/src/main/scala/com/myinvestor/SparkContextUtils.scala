package com.myinvestor

import org.apache.spark.streaming.{Milliseconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}

/**
  * Spark context helper.
  */
object SparkContextUtils {

  val settings = new AppSettings

  import settings._

  val sparkConf: SparkConf = new SparkConf().setAppName(AppName)
    .setMaster(SparkMaster)
    .set("spark.cassandra.connection.host", CassandraHosts)
    .set("spark.cleaner.ttl", SparkCleanerTtl.toString)
    .set("spark.cassandra.auth.username", CassandraAuthUsername.toString)
    .set("spark.cassandra.auth.password", CassandraAuthPassword.toString)

  val sparkContext: SparkContext = new SparkContext(sparkConf)

  val streamingContext: StreamingContext = new StreamingContext(sparkContext, Milliseconds(SparkStreamingBatchInterval))

  def startStreamingContext(): Unit = {
    streamingContext.checkpoint(SparkCheckpointDir)
    streamingContext.start()
  }

  def stopStreaminContext(): Unit = {
    streamingContext.stop(stopSparkContext = true, stopGracefully = true)
  }

}
