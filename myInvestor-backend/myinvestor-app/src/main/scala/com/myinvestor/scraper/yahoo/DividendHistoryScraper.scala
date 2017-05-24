package com.myinvestor.scraper.yahoo

import com.myinvestor.scraper.{ParserImplicits, ParserUtils}

/**
  * Dividend history scraper.
  */
class DividendHistoryScraper (val exchangeName: String, val symbols: Option[Array[String]]) extends ParserUtils with ParserImplicits {

  def run: Boolean = {
    var status = true

    status
  }
}

