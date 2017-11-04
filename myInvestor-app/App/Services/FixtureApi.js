import { filter, sortBy } from "lodash";

const KLSE = "KLSE";
const HKEX = "HKG";
const NASDAQ = "NASDAQ";
const NYSE = "NYSE";
const SGX = "SGX";

export default {
  // Functions return fixtures
  getMarkets: () => {
    return {
      ok: true,
      data: require("../Fixtures/market.json")
    };
  },
  getStocks: market => {
    console.log("market --" + JSON.stringify(market));
    var data = [];
    switch (market.exchangeName) {
      case KLSE:
        data = require("../Fixtures/KLSE.json");
        break;
      case HKEX:
        data = require("../Fixtures/KLSE.json");
        break;
      case NASDAQ:
        data = require("../Fixtures/KLSE.json");
        break;
      case NYSE:
        data = require("../Fixtures/KLSE.json");
        break;
      case SGX:
        data = require("../Fixtures/KLSE.json");
        break;
    }
    console.log('data -- ' + JSON.stringify(data));
    return {
      ok: true,
      data: data
    };
  },
  getDividends: (market, symbol) => {
    var dividends = [];
    switch (market.exchangeName) {
      case KLSE:
        dividends = require("../Fixtures/KLSE_dividend.json");
        break;
      case HKEX:
        dividends = require("../Fixtures/KLSE_dividend.json");
        break;
      case NASDAQ:
        dividends = require("../Fixtures/KLSE_dividend.json");
        break;
      case NYSE:
        dividends = require("../Fixtures/KLSE_dividend.json");
        break;
      case SGX:
        dividends = require("../Fixtures/KLSE_dividend.json");
        break;
    }
    var stockDividends = filter(dividends, function(d) {
      return d.gExchangeName === market && d.gStockSymbol === symbol;
    });
    stockDividends = sortBy(stockDividends, "dividendYear").reverse();
    return {
      ok: true,
      data: stockDividends
    };
  },
  getMappedStocks: (market, symbol) => {
    var stocks = [];
    switch (market.exchangeName) {
      case KLSE:
        stocks = require("../Fixtures/KLSE_mapper.json");
        break;
      case HKEX:
        stocks = require("../Fixtures/KLSE_mapper.json");
        break;
      case NASDAQ:
        stocks = require("../Fixtures/KLSE_mapper.json");
        break;
      case NYSE:
        stocks = require("../Fixtures/KLSE_mapper.json");
        break;
      case SGX:
        stocks = require("../Fixtures/KLSE_mapper.json");
        break;
    }
    var mappedStocks = filter(stocks, function(d) {
      return d.gExchangeName === market && d.gStockSymbol === symbol;
    });
    if (mappedStocks && mappedStocks.length > 0) {
      return {
        ok: true,
        data: mappedStocks
      };
    } else {
      return {
        ok: false,
        data: null
      };
    }
  }
};
