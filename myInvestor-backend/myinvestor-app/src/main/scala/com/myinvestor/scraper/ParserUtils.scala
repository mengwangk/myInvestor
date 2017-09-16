package com.myinvestor.scraper

import java.io.File
import java.net.URL

import org.jsoup.Jsoup
import org.jsoup.nodes.Document.OutputSettings
import org.jsoup.nodes.Element
import org.jsoup.safety.Whitelist

import scala.collection.convert.WrapAsScala._
import scala.sys.process._

trait ParserUtils {

  val ConnectionTimeout = 30000 // millis

  // "Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"
  //protected var USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1"
  protected var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"

  def fileDownloader(url: String, filename: String): Unit = {
    new URL(url) #> new File(filename) !!
  }

  def cleanText(rawText: String): String = {
    var text = Jsoup.clean(rawText, "", Whitelist.none(), new OutputSettings().prettyPrint(false))
    text.trim
  }

  def cleanHtml(rawText: String): String = {
    val text = rawText.replaceAll("[\"'()]", "")
    text.replaceAll("\u00A0", "")
  }

  def percentageValue(text: Option[Element]): Double = {
    if (text.isEmpty) return 0
    percentageValue(text.get.text())
  }

  def percentageValue(text: String): Double = {
    val value = cleanHtml(text.replaceAll("%", ""))
    numberValue(value)
  }

  def numberFromArr(arr: Option[Element], index: Int): Double = {
    if (arr.isEmpty) return 0
    numberFromArr(arr.get.text(), index)
  }

  def numberFromArr(arr: String, index: Int): Double = {
    try {
      var values = cleanHtml(arr).split('-')
      if (values.length > 0) {
        return values(index).replaceAll(",", "").toDouble
      }
    } catch {
      case e: Exception => None
    }
    0
  }

  //def toDouble(text: String): Double = {
  //  NumberFormat.getNumberInstance(java.util.Locale.US).parse(text).doubleValue()
  //}

  def numberValue(text: Option[Element]): Double = {
    if (text.isEmpty) return 0
    numberValue(text.get.text())
  }

  def numberValue(text: String): Double = {
    val value = cleanHtml(text)
    if (value.isEmpty) return 0
    if (value.equalsIgnoreCase("-")) return 0
    value.replaceAll(",", "").toDouble
  }

  def stringValue(text: Option[Element]): String = {
    if (text.isEmpty) return ""
    stringValue(text.get.text())
  }

  def stringValue(text: String): String = {
    val value = cleanHtml(text)
    if (value.isEmpty) return ""
    if (value.equalsIgnoreCase("-")) return ""
    value
  }
}

trait ParserImplicits {

  implicit class ElementExtensions(val element: Element) {
    def oneByClass(className: String): Option[Element] = element.getElementsByClass(className).toList.headOption

    def oneByTag(tagName: String): Option[Element] = element.getElementsByTag(tagName).toList.headOption

    def oneByAttribute(attributeName: String): Option[Element] = element.getElementsByAttribute(attributeName).toList.headOption

    def oneByCss(css: String): Option[Element] = element.select(css).toList.headOption

    def byId(id: String): Option[Element] = Option(element.getElementById(id))
  }

}


