/**
 * @flow
 */

"use strict";

import { persistStore, autoRehydrate } from "redux-persist";
import { ASyncStorage } from "react-native";
import thunk from "redux-thunk";

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

function configureStore(onComplete: ?() => void) {
  /*
  const store = autoRehydrate()(createMyInvestorStore)(reducers);
  persistStore(store, { storage: AsyncStorage }, onComplete);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
  */
  return null;
}

module.exports = configureStore;
