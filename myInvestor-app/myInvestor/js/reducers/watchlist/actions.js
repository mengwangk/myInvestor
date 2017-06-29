export const SET_WATCHLIST = "SET_WATCHLIST";

export function getWatchlist() {
  console.log("get watch list");
  var watchlist = "{'stock': 'YTLPOWR' }";
  return dispatch => dispatch(setWatchlist(watchlist));
}

export function setWatchlist(watchlist) {
  return {
    type: SET_WATCHLIST,
    watchlist
  };
}
