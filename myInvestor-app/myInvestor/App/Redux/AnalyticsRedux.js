/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:40:46 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 22:07:25
 */
import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getMarketsRequest: null,
  getMarketsSuccess: ["markets"],
  setMarketRequest: ["selectedMarket"],
  getStocksRequest: ["selectedMarket"],
  getStocksSuccess: ["stocks"],
  setStockRequest: ["selectedStock"],
  getStockDetailsRequest: ["selectedStock"],
  getStockDetailsSuccess: ["stockDetails"],
  getDividendsRequest: ["selectedMarket", "selectedStock"],
  getDividendsSuccess: ["dividends"]
});

export const AnalyticsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  error: null,
  selectedMarket: null,
  selectedStock: null,
  markets: [],
  stocks: [],
  stockDetails: [],
  dividends: []
});

/* ------------- Reducers ------------- */

export const requestMarkets = state =>
  state.merge({ fetching: true, markets: [] });

export const requestMarketsSuccess = (state, action) => {
  const { markets } = action;
  return state.merge({ fetching: false, markets: markets });
};

export const setMarket = (state, { selectedMarket }) => {
  return state.merge({ fetching: true, selectedMarket, stocks: [] });
};

export const requestStocks = (state, { selectedMarket }) => {
  return state.merge({ fetching: true, selectedMarket, stocks: [] });
};

export const requestStocksSuccess = (state, action) => {
  const { stocks } = action;
  return state.merge({ fetching: false, stocks: stocks });
};

export const setStock = (state, { selectedStock }) => {
  return state.merge({ fetching: false, selectedStock, stockDetails: [] });
};

export const requestDividends = (state, { selectedMarket, selectedStock }) => {
  return state.merge({ fetching: true, selectedMarket, selectedStock, dividends: [] });
};

export const requestDividendsSuccess = (state, action) => {
  const { dividends } = action;
  return state.merge({ fetching: false, dividends: dividends });
};

export const requestStockDetails = (state, { selectedStock }) => {
  return state.merge({ fetching: true, selectedStock });
};

export const requestStockDetailsSuccess = (state, { selectedStock }) => {
  return state.merge({ fetching: false, selectedStock });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_MARKET_REQUEST]: setMarket,
  [Types.GET_MARKETS_REQUEST]: requestMarkets,
  [Types.GET_MARKETS_SUCCESS]: requestMarketsSuccess,
  [Types.SET_MARKET_REQUEST]: setMarket,
  [Types.GET_STOCKS_REQUEST]: requestStocks,
  [Types.GET_STOCKS_SUCCESS]: requestStocksSuccess,
  [Types.SET_STOCK_REQUEST]: setStock,
  [Types.GET_STOCK_DETAILS_REQUEST]: requestStockDetails,
  [Types.GET_STOCK_DETAILS_SUCCESS]: requestStockDetailsSuccess,
  [Types.GET_DIVIDENDS_REQUEST]: requestDividends,
  [Types.GET_DIVIDENDS_SUCCESS]: requestDividendsSuccess,
});
