package com.myinvestor

import com.myinvestor.TradeSchema.DividendAchieverAnalysis
import com.myinvestor.fundamental.DividendSummarizer
import com.myinvestor.generator.StockDataGenerator
import com.myinvestor.scraper.google.StockScraper
import com.myinvestor.scraper.yahoo.{DividendHistoryScraper, G2YStockMapper, G2YStockMapperByName, StockInfoScraper2}
import com.typesafe.scalalogging.Logger
import org.apache.spark.SparkContext

/**
  * Test to scrap stock info from Google Finance
  */
class StockInfoScraperSpec extends UnitTestSpec {

  def fixture =
    new {
      val log = Logger("StockInfoScraperSpec")
      val sc: SparkContext = SparkContextUtils.sparkContext
      val settings = new AppSettings()
    }

  "Stock info scraper" should "grabs stock info from Google Finance" in {

    //val scraper = new StockInfoScraper("KLSE", Some(Array("YTLPOWR")))
    //val scraper = new StockInfoScraper("KLSE", None)
    //val scraper = new StockHistoryScraper("KLSE", None)
    //val scraper = new DividendHistoryScraper("KLSE",  Some(Array("YTLPOWR", "AASIA")))
    //val scraper = new DividendHistoryScraper("KLSE",  None)
    //val scraper = new StockInfoScraper2("KLSE", None)

    //val scraper = new StockDataGenerator("KLSE")
    //val scraper = new StockScraper("SGX")
    // val scraper = new G2YStockMapperByName("SGX")  // By name
    //val scraper = new G2YStockMapper("SGX")          // By symbol
    // val scraper = new DividendHistoryScraper("SGX",  None)

    //val scraper = new StockInfoScraper2("SGX", None)
    //scraper.run

    //val summarizer = new DividendSummarizer("SGX", None)
    //summarizer.run

    val scraper = new StockDataGenerator("NYSE")
    scraper.run
  }

}
