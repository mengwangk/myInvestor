/**
 * @flow
 */

"use strict";

import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage } from "react-native";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "../reducers";
import { promise } from "./promise";
import { analytics } from "./analytics";
import { array } from "./array";

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

/*
var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true
});
var createMyInvestorStore = applyMiddleware(
  thunk,
  promise,
  array,
  analytics,
  logger
)(createStore);
*/

function configureStore(onComplete: ?() => void) {
  const store = createStore(
    reducers,
    undefined,
    compose(applyMiddleware(thunk), autoRehydrate())
  );
  persistStore(store, { storage: AsyncStorage }, onComplete);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
