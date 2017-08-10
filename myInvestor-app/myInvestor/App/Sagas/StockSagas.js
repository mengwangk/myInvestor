/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-10 13:57:59
 */
import { call, put } from "redux-saga/effects";
import { path } from "ramda";
import StockActions from "../Redux/StockRedux";

export function* getMarkets(api, action) {
  var data = api.getMarkets().data;
  yield put(StockActions.getMarketsSuccess(data));
}
