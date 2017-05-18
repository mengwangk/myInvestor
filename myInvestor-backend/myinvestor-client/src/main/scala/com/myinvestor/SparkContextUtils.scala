package com.myinvestor

import com.datastax.spark.connector.{SomeColumns, _}
import com.myinvestor.TradeSchema._
import org.apache.spark.{SparkConf, SparkContext}

/**
  * Spark context helper.
  */
object SparkContextUtils {

  val settings = new ClientSettings
  import settings._

  val sparkConf: SparkConf = new SparkConf().setAppName(AppName)
    .setMaster(SparkMaster)
    .set("spark.cassandra.connection.host", CassandraHosts)
    .set("spark.cleaner.ttl", SparkCleanerTtl.toString)
    .set("spark.cassandra.auth.username", CassandraAuthUsername.toString)
    .set("spark.cassandra.auth.password", CassandraAuthPassword.toString)

  val sparkContext: SparkContext = new SparkContext(sparkConf)

  def saveRequest(request: Request): Unit = {
    val collection = sparkContext.parallelize(Seq(request))
    collection.saveToCassandra(Keyspace, RequestTable)
  }

  // TODO
  def deleteRequest(request:Request): Unit = {
    // val rdd = sparkContext.cassandraTable(Keyspace, RequestTable)
    //sparkContext.parallelize(Seq(request.requestId))
  }

}
