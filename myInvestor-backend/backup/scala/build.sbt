import Resolvers._

lazy val commonSettings = Seq(
  organization := "com.myinvestor",
  version := "0.1.0",
  scalaVersion := "2.11.8"
)

lazy val myInvestor = (project in file(".")).
  settings(commonSettings: _*).
  settings(
    name := "myInvestor"
  )


libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.1.7",
  "com.typesafe.scala-logging" % "scala-logging_2.11" % "3.5.0",
  "com.typesafe.scala-logging" % "scala-logging-slf4j_2.11" % "2.1.2",
  "com.typesafe" % "config" % "1.3.1",
  "eu.verdelhan" % "ta4j" % "0.8",
  "joda-time" % "joda-time" % "2.9.4",
  "com.datastax.spark" % "spark-cassandra-connector_2.11" % "2.0.0-M3",
  "org.apache.spark" % "spark-core_2.11" % "2.0.1",
  "org.apache.spark" % "spark-sql_2.11" % "2.0.1",
  "org.apache.spark" % "spark-streaming_2.11" % "2.0.1",
  "org.apache.spark" % "spark-graphx_2.11" % "2.0.1"
)

libraryDependencies ~= { _.map(_.exclude("org.slf4j", "slf4j-log4j12")) }