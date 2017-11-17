import React, { Component } from "react";
import { StackNavigator, DrawerItems } from 'react-navigation';
import { ScrollView, Image } from "react-native";
import NavigationDrawer from "../Components/NavigationDrawer";
import StockListScreen from "../Containers/StockListScreen";
import AnalyticsScreen from "../Containers/AnalyticsScreen";
import StockDetailsScreen from "../Containers/StockDetailsScreen";
import { getNavigationOptionsWithAction } from "../Lib/Navigation";
import I18n from "react-native-i18n";
import { Fonts, Colors, Metrics } from "../Themes/";

import styles from "./Styles/NavigationStyles";

const stockListNavigationOptions = ({ navigation }) =>
  getNavigationOptionsWithAction(
    I18n.t("stockListScreen"),
    Colors.background,
    Colors.text
  );

const analyticsNavigationOptions = ({ navigation }) =>
  getNavigationOptionsWithAction(
    I18n.t("analyticsScreen"),
    Colors.background,
    Colors.text
  );

const stockDetailsNavigationOptions = ({ navigation }) =>
  getNavigationOptionsWithAction(
    I18n.t("stockDetailsScreen"),
    Colors.background,
    Colors.text
  );

const createStackNavigator = StackNavigator(
  {
    NavigationDrawer: { screen: NavigationDrawer },
    AnalyticsScreen: {
      screen: AnalyticsScreen,
      navigationOptions: analyticsNavigationOptions
    },
    StockListScreen: {
      screen: StockListScreen,
      navigationOptions: stockListNavigationOptions
    },
    StockDetailsScreen: {
      screen: StockDetailsScreen,
      navigationOptions: stockDetailsNavigationOptions
    }
  },
  {
    initialRouteName: "NavigationDrawer"
  }
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator;

export default PrimaryNav;
