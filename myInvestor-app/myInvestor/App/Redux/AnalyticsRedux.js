/*
 * @Author: mwk 
 * @Date: 2017-08-09 17:40:46 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-04 11:50:32
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
  getStockDividendsRequest: ["selectedMarket", "selectedStock"],
  getStockDividendsSuccess: ["dividends"],
  getStockPriceInfoRequest: ["selectedMarket", "selectedStock"],
  getStockPriceInfoSuccess: ["priceInfo"],
  getStockPriceInfoError: ["error"]
});

export const AnalyticsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  error: null,
  markets: [],
  stocks: [],
  selectedMarket: null,
  selectedStock: null,
  dividends: [],
  priceInfo: null
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
  return state.merge({ fetching: false, selectedStock });
};

export const requestStockDividends = (state, { selectedMarket, selectedStock }) => {
  return state.merge({ fetching: true, selectedMarket, selectedStock, dividends: [] });
};

export const requestStockDividendsSuccess = (state, action) => {
  const { dividends } = action;
  return state.merge({ fetching: false, dividends: dividends });
};

export const requestStockPriceInfo = (state, { selectedMarket, selectedStock }) => {
  return state.merge({ fetching: true, selectedMarket, selectedStock, priceInfo: null });
};

export const requestStockPriceInfoSuccess = (state, action) => {
  const { priceInfo } = action;
  return state.merge({ fetching: false, priceInfo: priceInfo });
};

export const requestStockPriceInfoError = (state, action) => {
  const { error } = action;
  return state.merge({ fetching: false, error });
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
  [Types.GET_STOCK_DIVIDENDS_REQUEST]: requestStockDividends,
  [Types.GET_STOCK_DIVIDENDS_SUCCESS]: requestStockDividendsSuccess,
  [Types.GET_STOCK_PRICE_INFO_REQUEST]: requestStockPriceInfo,
  [Types.GET_STOCK_PRICE_INFO_SUCCESS]: requestStockPriceInfoSuccess,
  [Types.GET_STOCK_PRICE_INFO_ERROR]: requestStockPriceInfoError
});
