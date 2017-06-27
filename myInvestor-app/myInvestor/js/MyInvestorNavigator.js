/**
 * @flow
 */

"use strict";

import { DrawerNavigator } from "react-navigation";
import About from "./components/about";
import Dashboard from "./components/dashboard";

const MyInvestorNavigator = DrawerNavigator({
  Dashboard: { screen: Dashboard },
  About: { screen: About }
});

module.exports = MyInvestorNavigator;
