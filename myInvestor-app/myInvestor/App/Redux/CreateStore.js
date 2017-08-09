/*
 * @Author: mwk 
 * @Date: 2017-08-05 11:50:59 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-08 17:20:40
 */
import { createStore, applyMiddleware, compose } from "redux";
import { autoRehydrate } from "redux-persist";
import Config from "../Config/DebugConfig";
import createSagaMiddleware from "redux-saga";
import RehydrationServices from "../Services/RehydrationServices";
import ReduxPersist from "../Config/ReduxPersist";
import ScreenTracking from "./ScreenTrackingMiddleware";
import { createLogger } from "redux-logger";

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Analytics Middleware ------------- */
  middleware.push(ScreenTracking);

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = Config.useReactotron
    ? console.tron.createSagaMonitor()
    : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /*---- myInvestor - Redux Logger Middleware for debugging purpose ------------ */
  if (Config.reduxLogging) {
    const logger = createLogger();
    middleware.push(logger);
  }

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  /* ------------- AutoRehydrate Enhancer ------------- */

  // add the autoRehydrate enhancer
  if (ReduxPersist.active) {
    enhancers.push(autoRehydrate());
  }

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = Config.useReactotron
    ? console.tron.createStore
    : createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store);
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga);

  return store;
};
