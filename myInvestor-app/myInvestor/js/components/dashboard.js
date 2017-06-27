/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TabNavigator } from "react-navigation";
import About from "./about";

const Dashboard = TabNavigator(
  {
    About1: { screen: About },
    About2: { screen: About }
  },
  {
    tabBarPosition: "bottom"
  }
);

module.exports = Dashboard;
