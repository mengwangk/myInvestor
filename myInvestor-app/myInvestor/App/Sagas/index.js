import { all, takeLatest } from "redux-saga/effects";
import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

/* ------------- Types ------------- */
import { StartupTypes } from "../Redux/StartupRedux";
import { StockTypes } from "../Redux/StockRedux";

/* ------------- Sagas ------------- */
import { getMarkets } from "./StockSagas";
import { startup } from "./StartupSagas";

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.create();
const api = API.create();
const fixtureAPI = FixtureAPI;

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(StockTypes.GET_MARKETS_REQUEST, getMarkets, fixtureAPI)
  ]);
}
