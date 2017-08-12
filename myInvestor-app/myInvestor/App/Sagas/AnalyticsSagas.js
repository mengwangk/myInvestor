/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-12 10:10:37
 */
import { call, put } from "redux-saga/effects";
import { path } from "ramda";
import AnalyticsAction from "../Redux/AnalyticsRedux";

export function* getMarkets(api, action) {
  var response = yield call(api.getMarkets);
  yield put(AnalyticsAction.getMarketsSuccess(response.data));
}

export function* getStocks(api, action) {
  const { selectedMarket } = action;
  const response = yield call(api.getStocks, selectedMarket);
  yield put(AnalyticsAction.getStocksSuccess(response.data));
}
