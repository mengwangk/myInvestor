/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-11 22:31:33
 */
import { call, put } from "redux-saga/effects";
import { path } from "ramda";
import StockActions from "../Redux/StockRedux";

export function* getMarkets(api, action) {
  var response = yield call(api.getMarkets);
  yield put(StockActions.getMarketsSuccess(response.data));
}

export function* getStocks(api, action) {
  const { selectedMarket } = action;
  const response = yield call(api.getStocks, selectedMarket);
  yield put(StockActions.getStocksSuccess(response.data));
}
