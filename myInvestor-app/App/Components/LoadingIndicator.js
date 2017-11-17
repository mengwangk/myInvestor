import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, ActivityIndicator } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../Themes";
import styles from "./Styles/LoadingIndicatorStyle";

export default class LoadingIndicator extends Component {
  static propTypes = {
    show: PropTypes.bool
  };

  render() {
    if (this.props.show) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            color={Colors.cloud}
            size={Metrics.controls.largeIndicator}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}
