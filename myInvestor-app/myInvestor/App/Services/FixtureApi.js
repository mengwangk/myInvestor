const KLSE = "KLSE";
const HKEX = "HKEX";
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
    switch (market) {
      case KLSE:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case HKEX:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case NASDAQ:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case NYSE:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case SGX:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
    }
  },
  getDividends: (market, stock) => {
    switch (market) {
      case KLSE:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE_dividend.json")
        };
      case HKEX:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case NASDAQ:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case NYSE:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
      case SGX:
        return {
          ok: true,
          data: require("../Fixtures/KLSE/KLSE.json")
        };
    }
  }
};
