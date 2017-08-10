/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:40:46 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-10 11:55:32
 */
import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getMarketsRequest: null,
  getMarketsSuccess: ["data"]
});

export const StockTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  error: null,
  market: null,
  data: null
});

/* ------------- Reducers ------------- */

export const requestMarkets = (state) =>
  state.merge({ fetching: true, data: null });

export const requestMarketsSuccess = (state, action) => {
  cosole.log("action --" + JSON.stringify(action));
  const { data } = action;
  return state.merge({ fetching: false, error: null, data: data });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_MARKETS_REQUEST]: requestMarkets,
  [Types.GET_MARKETS_SUCCESS]: requestMarketsSuccess
});
