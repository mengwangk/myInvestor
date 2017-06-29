/**
 * @flow
 */
"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";

class Watchlist extends React.Component {
  render() {
    return (
      <Text>
        {this.props.watchlist}
      </Text>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    watchlist: state.watchlist
  };
}

export default connect(mapStateToProps)(Watchlist);
