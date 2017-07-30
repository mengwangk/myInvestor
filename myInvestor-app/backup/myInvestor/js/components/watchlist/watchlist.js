/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";

import styles from "../styles";

class Watchlist extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Watchlist",
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require("./images/watchlist.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate("Dashboard")}
        title="Go to Dashboard"
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    watchlist: state.watchlist
  };
}

export default connect(mapStateToProps)(Watchlist);
