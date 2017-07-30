/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import MyInvestorApp from "./MyInvestorApp";
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
        <Provider store={this.state.store}>
          <MyInvestorApp />
        </Provider>
      );
    }
  }
  return Main;
}

module.exports = startup;
