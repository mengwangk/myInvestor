import React, {Component} from "react";
import {View, ListView, Text, Image} from "react-native";
import {connect} from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {TabNavigator} from "react-navigation";
import HighlightScreen from "../Containers/HighlightScreen";
import TrendingScreen from "../Containers/TrendingScreen";

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
      activeTintColor: 'white',
      activeBackgroundColor: 'darkgreen',
      inactiveTintColor: 'black',
      inactiveBackgroundColor: 'green',
      labelStyle: {
        fontSize: 16,
        padding: 0
      }
    }
  }
);

HomeScreen.navigationOptions = {
  title: 'Home'
};

export default HomeScreen;