/*
 * @Author: mwk 
 * @Date: 2017-08-08 23:26:55 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-09 15:51:22
 */
import AppNavigation from "../Navigation/AppNavigation";

export const reducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state);
  return newState || state;
};
