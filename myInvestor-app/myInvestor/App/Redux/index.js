/*
 * @Author: mwk 
 * @Date: 2017-08-10 00:08:11 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-10 12:01:42
 */
import { combineReducers } from "redux";
import configureStore from "./CreateStore";
import rootSaga from "../Sagas/";

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    nav: require("./NavigationRedux").reducer
    stock: require("./StockRedux").reducer
  });

  return configureStore(rootReducer, rootSaga);
};
