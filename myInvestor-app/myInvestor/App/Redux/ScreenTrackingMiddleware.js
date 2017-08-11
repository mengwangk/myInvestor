/*
 * @Author: mwk 
 * @Date: 2017-08-11 22:17:35 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-11 22:20:19
 */
import { NavigationActions } from "react-navigation";
import Config from "../Config/DebugConfig";

// gets the current screen from navigation state
const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

const screenTracking = ({ getState }) => next => action => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    try {
      if (Config.useReactotron) { // Not used in production
        console.tron.log(`NAVIGATING ${currentScreen} to ${nextScreen}`);
      }
      // Example: Analytics.trackEvent('user_navigation', {currentScreen, nextScreen})
    } catch (e) {
      console.tron.log(e);
    }
  }
  return result;
};

export default screenTracking;
