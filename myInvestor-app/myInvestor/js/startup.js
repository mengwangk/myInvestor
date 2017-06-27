/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import MyInvestorNavigator from "./MyInvestorNavigator";
import configureStore from "./store/configureStore";

function startup(): ReactClass<{}> {
  // Initialization code here
  console.disableYellowBox = true;

  class Main extends React.Component {
    state: {
      isLoading: boolean,
      store: any
    };

    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(() => this.setState({ isLoading: false }))
      };
    }

    render() {
      return (
        <Provider store={this.store}>
          <MyInvestorNavigator />
        </Provider>
      );
    }
  }
  return Main;
}

global.LOG = (...args) => {
  console.log("/------------------------------\\");
  console.log(...args);
  console.log("\\------------------------------/");
  return args[args.length - 1];
};

module.exports = startup;
