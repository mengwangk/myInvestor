/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabNavigator } from "react-navigation";
import Watchlist from "../watchlist/watchlist";
import Portfolio from "../portfolio/portfolio";

// https://github.com/react-community/react-navigation/blob/master/docs/api/navigators/TabNavigator.md

const Dashboard = TabNavigator(
  {
    Watchlist: { screen: Watchlist },
    Portfolio: { screen: Portfolio }
  },
  {
    tabBarOptions: {
      activeTintColor: "#ffffff",
      showIcon: true,
      labelStyle: {
        fontSize: 12
      }
    },
    tabBarPosition: "bottom",
    animationEnabled: true
  }
);

module.exports = Dashboard;
