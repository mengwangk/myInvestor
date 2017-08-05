/*
 * @Author: mwk 
 * @Date: 2017-08-01 14:14:24 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-05 14:17:54
 */
import React, { Component } from "react";
import { DrawerNavigator, StackNavigator, DrawerItems } from "react-navigation";
import { ScrollView, Image } from "react-native";
import NavigationDrawer from "../Components/NavigationDrawer";
import LaunchScreen from "../Containers/LaunchScreen";
import styles from "./Styles/NavigationStyles";


const createStackNavigator = StackNavigator(
  {
    NavigationDrawer: { screen: NavigationDrawer },
    LaunchScreen: { screen: LaunchScreen }
  },
  {
    initialRouteName: "NavigationDrawer"
  }
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator;

export default PrimaryNav;
