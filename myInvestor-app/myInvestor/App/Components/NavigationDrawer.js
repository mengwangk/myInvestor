/*
 * @Author: mwk 
 * @Date: 2017-08-01 10:30:30 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-03 17:45:11
 */
import I18n from "react-native-i18n";
import React, { Component } from "react";
import { Button, DrawerNavigator, DrawerItems } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { ScrollView, Image } from "react-native";
import {
  getNavigationOptionsWithAction,
  getDrawerNavigationOptions,
  getDrawerConfig
} from "../Lib/Navigation";
import NavBarItem from "./NavBarItem";

import NavigationToolbar from "./NavigationToolbar";
import { Fonts, Colors, Metrics } from "../Themes/";
import styles from "./Styles/NavigationDrawerStyles";
import StockSearchBar from "../Components/StockSearchBar";
import HomeScreen from "../Containers/HomeScreen";
import WatchlistScreen from "../Containers/WatchlistScreen";
import SettingsScreen from "../Containers/SettingsScreen";
import LaunchScreen from "../Containers/LaunchScreen";
import SampleContainer from "../Containers/SampleContainer";
import SampleScreen from "../Containers/SampleScreen";
import AnalyticsScreen from "../Containers/AnalyticsScreen";

const getDrawerItem = navigation =>
  <NavBarItem
    iconName="bars"
    onPress={() => {
      if (navigation.state.index === 0) {
        // check if drawer is not open, then only open it
        navigation.navigate("DrawerOpen");
      } else {
        // else close the drawer
        navigation.navigate("DrawerClose");
      }
    }}
  />;

const getDrawerIcon = (iconName, tintColor) =>
  <Icon name={iconName} size={Metrics.icons.small} color={tintColor} />;

const homeDrawerIcon = ({ tintColor }) => getDrawerIcon("home", tintColor);
const analyticsDrawerIcon = ({ tintColor }) =>
  getDrawerIcon("bar-chart", tintColor);


const homeNavOptions = getDrawerNavigationOptions(
  I18n.t("homeScreen"),
  Colors.background,
  Colors.text,
  homeDrawerIcon,
  <NavigationToolbar/>
);

const analyticsNavOptions = getDrawerNavigationOptions(
  I18n.t("analyticsScreen"),
  Colors.background,
  Colors.text,
  analyticsDrawerIcon
);

const ScrollDrawerContentComponent = props =>
  <ScrollView style={styles.scrollView}>
    <DrawerItems {...props} />
  </ScrollView>;

const navigationDrawerContentOptions = {
  activeBackgroundColor: Colors.cloud,
  activeTintColor: Colors.snow,
  inactiveTintColor: Colors.snow,
  inactiveBackgroundColor: Colors.background,
  style: styles.drawerContent
};

const NavigationDrawer = DrawerNavigator(
  {
    HomeScreen: { screen: HomeScreen, navigationOptions: homeNavOptions },
    AnalyticsScreen: {
      screen: AnalyticsScreen,
      navigationOptions: analyticsNavOptions
    }
  },
  getDrawerConfig(
    300,
    "left",
    "HomeScreen",
    ScrollDrawerContentComponent,
    navigationDrawerContentOptions
  )
);

NavigationDrawer.navigationOptions = ({ navigation }) =>
  getNavigationOptionsWithAction(
    I18n.t("appName"),
    Colors.background,
    Colors.text,
    getDrawerItem(navigation)
  );

export default NavigationDrawer;
