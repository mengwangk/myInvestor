import React, {Component} from "react";
import {View, ListView, Text, Image} from "react-native";
import {connect} from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {TabNavigator} from "react-navigation";
import HighlightScreen from "../Containers/HighlightScreen";
import TrendingScreen from "../Containers/TrendingScreen";
import I18n from "react-native-i18n";
import { ApplicationStyles, Metrics, Colors, Fonts } from '../Themes'

import styles from "./Styles/HomeScreenStyle";

var HomeScreen = TabNavigator({
    HighlightScreen: {
      screen: HighlightScreen
    },
    TrendingScreen: {
      screen: TrendingScreen
    }
  }, 
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: Colors.black,
      activeBackgroundColor: Colors.purpleShadow1,
      inactiveTintColor: Colors.black,
      inactiveBackgroundColor: Colors.purpleShadow2,
      labelStyle: {
        fontSize: Fonts.size.small,
        padding: Metrics.tinyMargin
      },
      style: {
        backgroundColor: Colors.headerPurple,
      },
    }
  }
);

HomeScreen.navigationOptions = {
  title: I18n.t("homeScreen")
};

export default HomeScreen;