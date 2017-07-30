/**
 * @flow
 */

"use strict";

import { DrawerNavigator } from "react-navigation";
import About from "./components/about/about";
import Dashboard from "./components/dashboard/dashboard";
import Settings from "./components/settings/settings";

const MyInvestorNavigator = DrawerNavigator({
  Dashboard: { screen: Dashboard },
  Settings: { screen: Settings }
});

module.exports = MyInvestorNavigator;
