/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-04 22:03:25
 */
import { delay } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { path } from "ramda";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import MyInvestorFinance from "react-native-finance-lib";

export const getMarkets = function* getMarkets(api, action) {
  var response = yield call(api.getMarkets);
  yield put(AnalyticsActions.getMarketsSuccess(response.data));
};

export const getStocks = function* getStocks(api, action) {
  const { selectedMarket } = action;
  // yield call(delay, 10000);
  const response = yield call(api.getStocks, selectedMarket);
  yield put(AnalyticsActions.getStocksSuccess(response.data));
};

export const getStockDividends = function* getStockDividends(api, action) {
  const { selectedMarket, selectedStock } = action;
  const response = yield call(
    api.getDividends,
    selectedMarket,
    selectedStock.stockSymbol
  );
  yield put(AnalyticsActions.getStockDividendsSuccess(response.data));
};

export const getStockPriceInfo = function* getStockPriceInfo(api, action) {
  // https://stackoverflow.com/questions/42307648/promises-in-redux-saga
  try {
    const { selectedMarket, selectedStock } = action;
    const response = api.getMappedStocks(
      selectedMarket,
      selectedStock.stockSymbol
    );
    if (response.ok) {
      const mappedStock = response.data[0];
      const priceInfo = yield call(MyInvestorFinance.getStockPrice, mappedStock.yStockSymbol);
      yield put(AnalyticsActions.getStockPriceInfoSuccess(priceInfo));
    } else {
      yield put(AnalyticsActions.getStockPriceInfoError("Unable to get stock price information"));
    }
  } catch (error) {
    yield put(AnalyticsActions.getStockPriceInfoError(error));
  }
};
