import React, { Component } from "react";
import { DrawerNavigator, StackNavigator, DrawerItems } from "react-navigation";
import { ScrollView, Image } from "react-native";
import HomeScreen from "../Containers/HomeScreen";
import WatchlistScreen from "../Containers/WatchlistScreen";
import SettingsScreen from "../Containers/SettingsScreen";
import LaunchScreen from "../Containers/LaunchScreen";
import SampleContainer from "../Containers/SampleContainer";
import SampleScreen from "../Containers/SampleScreen";

import styles from "./Styles/NavigationStyles";

class DrawerView extends React.Component {
  render() {
    return (
      <ScrollView><DrawerItems {...this.props} /></ScrollView>
    );
  }
}

// Manifest of possible screens
const PrimaryNav = DrawerNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    WatchlistScreen: { screen: WatchlistScreen },
    SettingsScreen: { screen: SettingsScreen },
    LaunchScreen: { screen: LaunchScreen },
    SampleContainer: { screen: SampleContainer },
    SampleScreen: { screen: SampleScreen }
  },
  {
    // Default config for all screens
    initialRouteName: "HomeScreen",
    contentComponent: DrawerView,    
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

export default PrimaryNav;
