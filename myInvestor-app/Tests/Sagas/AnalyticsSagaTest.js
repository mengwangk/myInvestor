/*
 * @Author: mwk 
 * @Date: 2017-09-04 15:46:14 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-04 16:03:15
 */
import FixtureAPI from "../../App/Services/FixtureApi";
import { put, call } from "redux-saga/effects";
import { getStockPriceInfo } from "../../App/Sagas/AnalyticsSagas";
import AnalyticsActions from "../../App/Redux/AnalyticsRedux";
import { path } from "ramda";
import "react-native-finance-lib";

const stepper = fn => mock => fn.next(mock).value;

test("Get stock price info", () => {
  const step = stepper(
    getStockPriceInfo(FixtureAPI, {
      selectedMarket: "KLSE",
      selectedStock: { stockSymbol: "YTLPOWR" }
    })
  );
});
