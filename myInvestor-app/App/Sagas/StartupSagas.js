import { put, select } from "redux-saga/effects";
import { is } from "ramda";
import AnalyticsActions from "../Redux/AnalyticsRedux";

// process STARTUP actions
export const startup = function* startup(action) {
  if (__DEV__ && console.tron) {
    // straight-up string logging
    console.tron.log("myInvestor startup saga.");
  }
  yield put(AnalyticsActions.getMarketsRequest());
};
