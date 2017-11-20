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
});

HomeScreen.navigationOptions = {
  title: 'Home1'
};

export default HomeScreen;