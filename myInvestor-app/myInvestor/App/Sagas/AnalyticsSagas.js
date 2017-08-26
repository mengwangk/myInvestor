/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 21:31:17
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

export const getDividends = function* getDividends(api, action) {
  const { selectedMarket, selectedStock } = action;
  const response = yield call(api.getDividends, selectedMarket, selectedStock);
  yield put(AnalyticsActions.getDividendsSuccess(response.data));
};
