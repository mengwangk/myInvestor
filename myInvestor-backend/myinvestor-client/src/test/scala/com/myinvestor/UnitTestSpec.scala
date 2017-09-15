package com.myinvestor

import org.scalatest._

/**
  * Base class for all unit test scenarios.
  */
abstract class UnitTestSpec extends FlatSpec with Matchers with OptionValues with Inside with Inspectors {

}
