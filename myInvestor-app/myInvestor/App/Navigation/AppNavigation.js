/*
 * @Author: mwk 
 * @Date: 2017-08-01 14:14:24 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-01 19:37:13
 */
import React, { Component } from "react";
import { DrawerNavigator, StackNavigator, DrawerItems } from "react-navigation";
import { ScrollView, Image } from "react-native";
import NavigationDrawer from "../Components/NavigationDrawer";
import styles from "./Styles/NavigationStyles";


const createStackNavigator = StackNavigator(
  {
    NavigationDrawer: { screen: NavigationDrawer }
  },
  {
    initialRouteName: "NavigationDrawer"
  }
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator;

export default PrimaryNav;
