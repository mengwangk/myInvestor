libraryDependencies ~= { _.map(_.exclude("org.slf4j", "slf4j-log4j12")) }

lazy val appSettings = Seq(
  name := Versions.name, 
  organization := Versions.organization, 
  promptTheme := ScalapenosTheme,
  homepage := Some(url(Versions.homePage)),
  licenses := Seq((Versions.apacheLicense, url(Versions.apacheLicenseUrl)))
)

lazy val compileSettings = Seq(
  version := Versions.myInvestor,
  scalaVersion := Versions.Scala,
  scalacOptions ++= Seq("-encoding", "UTF-8", s"-target:jvm-${Versions.JDK}", "-feature", "-language:_", "-deprecation", "-unchecked", "-Xlint"),
  javacOptions in Compile ++= Seq("-encoding", "UTF-8", "-source", Versions.JDK, "-target", Versions.JDK, "-Xlint:deprecation", "-Xlint:unchecked"),
  run in Compile := Defaults.runTask(fullClasspath in Compile, mainClass in (Compile, run), runner in (Compile, run))
)

lazy val myinvestor = (project in file(".")).
  settings(appSettings: _*).
  settings(
    name := "myinvestor"
  ).
  aggregate(core, app, client, example)


lazy val core = (project in file("./myinvestor-core")).
  settings(compileSettings: _*).
  settings(
    name := "core",
    libraryDependencies ++= Dependencies.core,
    assemblyJarName in assembly := "myinvestor-core.jar"
  )


lazy val app = (project in file("./myinvestor-app")).
  settings(compileSettings: _*).
  settings(
    name := "app",
    libraryDependencies ++= Dependencies.app,
    assemblyJarName in assembly := "myinvestor-app.jar"
    // mainClass in assembly := Some("com.myinvestor.XX")
  ).dependsOn(core)


lazy val client = (project.dependsOn(core) in file("./myinvestor-client")).
  settings(compileSettings: _*).
  settings(
    name := "client",
    libraryDependencies ++= Dependencies.client,
    assemblyJarName in assembly := "myinvestor-client.jar"
    // mainClass in assembly := Some("com.myinvestor.XX")
  ).dependsOn(core)

lazy val example = (project in file("./myinvestor-example")).
  settings(compileSettings: _*).
  settings(
    name := "example",
    libraryDependencies ++= Dependencies.example,
    assemblyJarName in assembly := "myinvestor-example.jar"
    // mainClass in assembly := Some("com.myinvestor.XX")
  ).dependsOn(core)



