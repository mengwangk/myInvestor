/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabNavigator } from "react-navigation";
import Watchlist from "../watchlist/watchlist";
import Portfolio from "../portfolio/portfolio";

const Dashboard = TabNavigator(
  {
    Watchlist: { screen: Watchlist },
    Portfolio: { screen: Portfolio }
  },
  {
    tabBarPosition: "bottom"
  }
);

module.exports = Dashboard;
