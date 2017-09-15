package com.myinvestor

import com.myinvestor.TradeSchema.Request
import com.myinvestor.TradeHelper._


/**
  * Testing for Spark Cassandra scenarios.
  */
class SparkCassandraSpec extends UnitTestSpec {
  def fixture =
    new {
    }

  "A request" should "have a record in Cassandra table" in {

    // Create a new request with success = false
    val uuid = UUIDVersion4
    val request1 = Request(uuid, false, "")
    SparkContextUtils.saveRequest(request1)

    // Update the request to true
    val request2 = Request(uuid, true, "no error")
    SparkContextUtils.saveRequest(request2)

    assert(request1.requestId == request2.requestId)

    // Delete the request - Not available in 2.0.0-M3


  }

}
