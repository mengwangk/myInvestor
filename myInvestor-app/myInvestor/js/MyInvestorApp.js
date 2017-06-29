/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar, AppState } from "react-native";
import { connect } from "react-redux";
import MyInvestorNavigator from "./MyInvestorNavigator";

import { getWatchlist } from "./reducers/watchlist/actions";

class MyInvestorApp extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);

    // Dispatch
    // this.props.dispatch(getWatchlist());
  }

  handleAppStateChange(appState) {
    console.log("handle app state change");
  }

  render() {
    return <MyInvestorNavigator />;
  }
}

export default connect()(MyInvestorApp);
