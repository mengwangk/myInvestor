import { SET_WATCHLIST } from "./actions";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WATCHLIST:
      return action.watchlist;
    default:
      return state;
  }
};
