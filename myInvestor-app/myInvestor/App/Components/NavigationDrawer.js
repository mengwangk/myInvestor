/*
 * @Author: mwk 
 * @Date: 2017-08-01 10:30:30 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-01 19:38:08
 */
import { DrawerNavigator, DrawerItems } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";
import { ScrollView, Image } from "react-native";
import {
  getNavigationOptionsWithAction,
  getDrawerNavigationOptions,
  getDrawerConfig
} from "../Lib/Navigation";
import NavBarItem from "./NavBarItem";
import { Fonts, Colors, Metrics } from "../Themes/";
import HomeScreen from "../Containers/HomeScreen";
import WatchlistScreen from "../Containers/WatchlistScreen";
import SettingsScreen from "../Containers/SettingsScreen";
import LaunchScreen from "../Containers/LaunchScreen";
import SampleContainer from "../Containers/SampleContainer";
import SampleScreen from "../Containers/SampleScreen";

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

const homeNavOptions = getDrawerNavigationOptions(
  "Home",
  Colors.primary,
  Colors.snow,
  homeDrawerIcon
);

const NavigationDrawer = DrawerNavigator(
  {
    HomeScreen: { screen: HomeScreen, navigationOptions: homeNavOptions }
  },
  getDrawerConfig(300, "left", "HomeScreen")
);

NavigationDrawer.navigationOptions = ({ navigation }) =>
  getNavigationOptionsWithAction(
    "myInvestor",
    Colors.primary,
    Colors.snow,
    getDrawerItem(navigation)
  );

export default NavigationDrawer;
