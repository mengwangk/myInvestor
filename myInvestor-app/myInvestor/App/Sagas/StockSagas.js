/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:39:53 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-10 00:05:19
 */
import { call, put } from "redux-saga/effects";
import { path } from "ramda";
import StockActions from "../Redux/StockRedux";

export function* getMarkets(api, action) {
  yield put(StockActions.getMarketsSuccess('everything is okay'));
}
