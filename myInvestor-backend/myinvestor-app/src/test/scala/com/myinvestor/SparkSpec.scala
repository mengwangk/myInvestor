package com.myinvestor

import org.apache.spark.SparkContext
import org.apache.spark.streaming.StreamingContext
import org.scalatest.{BeforeAndAfterAll, Failed, Outcome, Suite}

/**
  */
trait SparkSpec extends BeforeAndAfterAll {
  this: Suite =>

  var sparkContext: SparkContext = _
  var streamingContext: StreamingContext = _

  override def beforeAll(): Unit = {
    super.beforeAll()

    sparkContext = SparkContextUtils.sparkContext
    streamingContext = SparkContextUtils.streamingContext
  }

  override def afterAll(): Unit = {
    if (sparkContext != null) {
      sparkContext.stop()
    }
    super.afterAll()
  }

}
