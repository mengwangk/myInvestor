import { all, takeLatest } from "redux-saga/effects";
import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

/* ------------- Types ------------- */
import { StartupTypes } from "../Redux/StartupRedux";
import { AnalyticsTypes } from "../Redux/AnalyticsRedux";

/* ------------- Sagas ------------- */
import { getMarkets, getStocks } from "./AnalyticsSagas";
import { startup } from "./StartupSagas";

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.create();
const api = API.create();
const fixtureAPI = FixtureAPI;

/* ------------- Connect Types To Sagas ------------- */
const root = function* root() {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(AnalyticsTypes.GET_MARKETS_REQUEST, getMarkets, fixtureAPI),
    takeLatest(AnalyticsTypes.GET_STOCKS_REQUEST, getStocks, fixtureAPI)
  ]);
};
export default root;
