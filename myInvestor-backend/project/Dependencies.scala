import sbt._

/**
  * Module dependencies.
  */
object Dependencies {

  import Versions._

  implicit class Exclude(module: ModuleID) {
    // def log4jExclude: ModuleID =
    //   module excludeAll (ExclusionRule("none"))   // Default to log4j. Removed for now.

    def sparkExclusions: ModuleID =
      module
        .exclude("com.google.guava", "guava")
       // .exclude("org.slf4j", "slf4j-log4j12")

    def cassandraExclusions: ModuleID =
      module
        .exclude("com.google.guava", "guava")
        //.excludeAll(ExclusionRule("org.slf4j"))

    def kafkaExclusions: ModuleID =
      module
        //.excludeAll(ExclusionRule("org.slf4j"))
        .exclude("com.sun.jmx", "jmxri")
        .exclude("com.sun.jdmk", "jmxtools")
        .exclude("net.sf.jopt-simple", "jopt-simple")

  }

  object Library {
    val technicalAnalysis: ModuleID = "eu.verdelhan" % "ta4j" % TAVersion
    val logback: ModuleID = "ch.qos.logback" % "logback-classic" % Logback
    val scalaLogging: ModuleID = "com.typesafe.scala-logging" %% "scala-logging" % ScalaLogging
    val scalaLoggingSlf4j: ModuleID = "com.typesafe.scala-logging" %% "scala-logging-slf4j" % ScalaLoggingSlf4j  // % "provided"
    val scalaConfig: ModuleID = "com.typesafe" % "config" % ScalaConfig
    val jodaTime: ModuleID = "joda-time" % "joda-time" % JodaTime % "compile;runtime"
    val sparkCassandraConnector: ModuleID = "com.datastax.spark" %% "spark-cassandra-connector" % SparkCassandra
    val sparkCore: ModuleID = "org.apache.spark" %% "spark-core" % Spark sparkExclusions
    val sparkSql: ModuleID = "org.apache.spark" %% "spark-sql" % Spark sparkExclusions
    val sparkStreaming: ModuleID = "org.apache.spark" %% "spark-streaming" % Spark sparkExclusions
    val sparkStreamingKafka: ModuleID = "org.apache.spark" %% "spark-streaming-kafka-0-10" % Spark sparkExclusions
    val sparkGraphx: ModuleID = "org.apache.spark" %% "spark-graphx" % Spark sparkExclusions

    val akkaActor: ModuleID = "com.typesafe.akka" %% "akka-actor" % Akka
    val akkaAgent: ModuleID = "com.typesafe.akka" %% "akka-agent" % Akka
    val akkaCluster: ModuleID = "com.typesafe.akka" %% "akka-cluster" % Akka
    val akkaClusterMetrics: ModuleID = "com.typesafe.akka" %% "akka-cluster-metrics" % Akka
    val akkaSlf4j: ModuleID = "com.typesafe.akka" %% "akka-slf4j" % Akka
    val akkaStream: ModuleID = "com.typesafe.akka" %% "akka-stream" % Akka
    val akkaRemote: ModuleID = "com.typesafe.akka" %% "akka-remote" % Akka
    val akkaPersistence: ModuleID = "com.typesafe.akka" %% "akka-persistence" % Akka

    val akkaHttpCore: ModuleID = "com.typesafe.akka" %% "akka-http-core" % AkkaHttp
    val akkaHttpJson: ModuleID = "com.typesafe.akka" %% "akka-http-spray-json" % AkkaHttp
    val akkaHttp: ModuleID = "com.typesafe.akka" %% "akka-http" % AkkaHttp
    val kafka: ModuleID = "org.apache.kafka" %% "kafka" % Kafka kafkaExclusions
    val kafkaStream: ModuleID = "org.apache.kafka" % "kafka-streams" % Kafka kafkaExclusions
    val guava: ModuleID = "com.google.guava" % "guava" % Guava

    // For Akka 2.5.x and Scala 2.12.x
    val akkaQuartzScheduler: ModuleID = "com.enragedginger" %% "akka-quartz-scheduler" % AkkaQuartzScheduler

    // For Web scraping
    //val scaleScrape: ModuleID = "com.bfil" %% "scalescrape" % ScraperVersion
    val jSoup: ModuleID = "org.jsoup" % "jsoup" % JSoup

    val yahooFinanceApi: ModuleID = "com.yahoofinance-api" % "YahooFinanceAPI" % YahooFinanceApi

    // For spray http
    val sprayHttpx : ModuleID = "io.spray" %% "spray-httpx" % Spray
    val sprayClient: ModuleID = "io.spray" %% "spray-client" % Spray
  }

  object Test {
    val akkaTestKit: ModuleID = "com.typesafe.akka" %% "akka-testkit" % Akka % "test"
    val scalatest: ModuleID = "org.scalatest" %% "scalatest" % ScalaTest % "test"
    val scalactic: ModuleID = "org.scalactic" %% "scalactic" % ScalaTest % "test"
    val supersafe: ModuleID = "com.artima.supersafe" % "supersafe_2.12.3" % SuperSafe % "test"
    val log4j: ModuleID = "log4j" % "log4j" % Log4j % "test"
  }

  import Library._

  val spark = Seq(sparkCassandraConnector, sparkCore, sparkSql, sparkStreaming, sparkStreamingKafka, sparkGraphx)

  val logging = Seq(logback, scalaLogging, scalaLoggingSlf4j)

  val utils = Seq(guava)

  val ta = Seq(technicalAnalysis)

  val time = Seq(jodaTime)

  val config = Seq(scalaConfig)

  val scheduler = Seq(akkaQuartzScheduler, jSoup, sprayHttpx, sprayClient)

  val akka = Seq(akkaActor, akkaAgent, akkaCluster, akkaClusterMetrics, akkaSlf4j, akkaStream, akkaRemote, akkaPersistence, akkaHttp, akkaHttpCore, akkaHttpJson)

  val test = Seq(Test.akkaTestKit, Test.scalatest, Test.scalactic, Test.supersafe, Test.log4j)

  val finance = Seq(yahooFinanceApi)

  // Module dependencies
  val core = spark ++ time ++ config ++ logging ++ akka ++ utils

  val client = spark ++ ta ++ akka ++ test

  val app = spark ++ ta ++ akka ++ Seq(kafka, kafkaStream) ++ test ++ scheduler ++ finance ++ logging

  val example = spark ++ ta

}

