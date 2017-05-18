package com.myinvestor

import com.datastax.spark.connector._
import com.datastax.spark.connector.CassandraRow
import com.datastax.spark.connector.rdd.CassandraRDD
import org.apache.spark.{SparkConf, SparkContext}

/**
  * Very simple example of how to connect Spark and Cassandra.
  * Run on the command line with: sbt examples/run
  */
object SimpleSparkJob {

  def main(args: Array[String]): Unit = {

    // The setMaster("local") lets us run & test the job right in our IDE
    val conf = new SparkConf(true).set("spark.cassandra.connection.host", "127.0.0.1").setMaster("local[*]").setAppName(getClass.getName)

    // "local" here is the master, meaning we don't explicitly have a spark master set up
    val sc = new SparkContext(conf)

    // keyspace & table
    val table: CassandraRDD[CassandraRow] = sc.cassandraTable("myinvestor", "trading_data")

    // get a simple count of all the rows in the demo table
    val rowCount = table.count()
    println(s"Total Rows in Trading Table: $rowCount")
    sc.stop()
  }
}
