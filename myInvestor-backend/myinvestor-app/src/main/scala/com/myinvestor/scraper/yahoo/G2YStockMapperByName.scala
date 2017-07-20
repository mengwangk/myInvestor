package com.myinvestor.scraper.yahoo

class G2YStockMapperByName(override val exchangeName: String, override val symbols: Option[Array[String]])
  extends G2YStockMapper(exchangeName, symbols) {

  override def run: Boolean = {
    this.mappedByName = true
    super.run
  }
}
