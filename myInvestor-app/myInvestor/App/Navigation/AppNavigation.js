/*
 * @Author: mwk 
 * @Date: 2017-08-01 14:14:24 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-08 16:19:03
 */
import React, { Component } from "react";
import { StackNavigator, DrawerItems } from "react-navigation";
import { ScrollView, Image } from "react-native";
import NavigationDrawer from "../Components/NavigationDrawer";
import StockPickerScreen from "../Containers/StockPickerScreen";
import AnalyticsScreen from "../Containers/AnalyticsScreen";
import { getNavigationOptionsWithAction } from "../Lib/Navigation";
import I18n from "react-native-i18n";
import { Fonts, Colors, Metrics } from "../Themes/";

import styles from "./Styles/NavigationStyles";

const stockPickerNavigationOptions = ({ navigation }) =>
  getNavigationOptionsWithAction(
    I18n.t("stockPickerScreen"),
    Colors.background,
    Colors.text
  );

const createStackNavigator = StackNavigator(
  {
    NavigationDrawer: { screen: NavigationDrawer },
    AnalyticsScreen: { screen: AnalyticsScreen },
    StockPickerScreen: { screen: StockPickerScreen, navigationOptions: stockPickerNavigationOptions }
  },
  {
    initialRouteName: "NavigationDrawer"
  }
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator;

export default PrimaryNav;