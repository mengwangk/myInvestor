package com.myinvestor.scraper

import org.jsoup.Jsoup
import org.jsoup.nodes.Document.OutputSettings
import org.jsoup.nodes.Element
import org.jsoup.safety.Whitelist

import scala.collection.convert.WrapAsScala._

trait ParserUtils {

  val ConnectionTimeout = 7000 // millis

  def clearText(rawText: String) = {
    var text = Jsoup.clean(rawText, "", Whitelist.none(), new OutputSettings().prettyPrint(false))
    if (text.size > 2000) text = text.substring(0, 2000) + "..."
    text.trim
  }
}

trait ParserImplicits {

  implicit class ElementExtensions(val element: Element) {
    def oneByClass(className: String): Option[Element] = element.getElementsByClass(className).toList.headOption

    def oneByTag(tagName: String): Option[Element] = element.getElementsByTag(tagName).toList.headOption

    def byId(id: String): Option[Element] = Option(element.getElementById(id))
  }

}