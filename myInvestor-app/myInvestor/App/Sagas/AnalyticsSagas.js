/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-04 10:22:04
 */
import { delay } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { path } from "ramda";
import AnalyticsActions from "../Redux/AnalyticsRedux";

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
  const response = yield call(api.getDividends, selectedMarket, selectedStock);
  yield put(AnalyticsActions.getStockDividendsSuccess(response.data));
};

export const getStockPriceInfo = function* getStockPriceInfo(action) {
  // https://stackoverflow.com/questions/42307648/promises-in-redux-saga
  try {
    const { symbol } = action;
  } catch (error) {
    // yield put();
  }
};
