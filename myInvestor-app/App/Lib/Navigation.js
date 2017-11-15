import React, { Component } from "react";
import { DrawerNavigator, DrawerItems } from "react-navigation";
import { Button, ScrollView, Picker } from "react-native";
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
  headerRight: headerRightComponent
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
