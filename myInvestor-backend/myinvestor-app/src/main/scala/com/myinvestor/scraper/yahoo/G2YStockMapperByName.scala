package com.myinvestor.scraper.yahoo

class G2YStockMapperByName(override val exchangeName: String) extends G2YStockMapper(exchangeName) {

  override def run: Boolean = {
    this.mappedByName = true
    super.run
  }
}
