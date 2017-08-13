/*
 * @Author: mwk 
 * @Date: 2017-08-13 15:02:07 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-13 20:54:25
 */
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
            size={Metrics.largeIndicator}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}
