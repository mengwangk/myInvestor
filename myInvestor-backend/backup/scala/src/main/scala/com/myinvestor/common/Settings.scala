package com.myinvestor.common

import com.typesafe.config.{Config, ConfigFactory}

/**
  * Application settings.
  */
class Settings(config: Config) {

  val context = new SettingsContext(config)
  val sparkMaster = context.sparkMaster
  val sparkAppName = context.sparkAppName
  val cassandraHost = context.cassandraHost
  val cassandraUser = context.cassandraUser
  val cassandraUserPassword = context.cassandraUserPassword
  val exchangeId = context.exchangeId

  def this() {
    this(ConfigFactory.load())
  }

  /**
    * Use for debugging purpose only.
    *
    * @param path Path to the parameter
    */
  def printSetting(path: String) {
    println("The setting '" + path + "' is: " + config.getString(path))
  }

  /**
    * Class to encapsulate the settings.
    *
    * @param config
    */
  class SettingsContext(config: Config) {

    config.checkValid(ConfigFactory.defaultReference(), "myInvestor")

    val sparkMaster = config.getString("myInvestor.sparkMaster")
    val sparkAppName = config.getString("myInvestor.sparkAppName")
    val cassandraHost = config.getString("myInvestor.cassandraHost")
    val cassandraUser = config.getString("myInvestor.cassandraUser")
    val cassandraUserPassword = config.getString("myInvestor.cassandraUserPassword")
    val exchangeId = config.getString("myInvestor.exchangeId")
  }

}



