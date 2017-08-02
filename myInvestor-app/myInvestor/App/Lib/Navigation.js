/*
 * @Author: mwk 
 * @Date: 2017-07-31 23:58:29 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-02 17:12:17
 */

import React, { Component } from "react";
import { DrawerNavigator, DrawerItems } from "react-navigation";
import { Button, ScrollView } from "react-native";
import { Fonts, Colors, Metrics } from "../Themes/";

export const getNavigationOptions = (title, backgroundColor, color) => ({
  title,
  headerTitle: title,
  headerStyle: {
    backgroundColor
  },
  headerTitleStyle: {
    color
  },
  headerTintColor: color
});

export const getNavigationOptionsWithAction = (
  title,
  backgroundColor,
  color,
  headerLeft
) => ({
  title,
  headerStyle: {
    backgroundColor
  },
  headerTitleStyle: {
    color
  },
  headerTintColor: color,
  headerLeft
});

export const getDrawerNavigationOptions = (
  title,
  backgroundColor,
  titleColor,
  drawerIcon,
  headerRightComponent
) => ({
  title,
  headerTitle: title,
  headerStyle: {
    backgroundColor
  },
  headerTitleStyle: {
    color: titleColor
  },
  headerTintColor: titleColor,
  drawerLabel: title,
  drawerIcon,
  headerRight: <Button title='xb'/>
});

export const getDrawerConfig = (
  drawerWidth,
  drawerPosition,
  initialRouteName,
  contentComponent,
  contentOptions
) => ({
  drawerWidth,
  drawerPosition,
  initialRouteName,
  contentComponent: contentComponent,
  contentOptions: contentOptions
});
