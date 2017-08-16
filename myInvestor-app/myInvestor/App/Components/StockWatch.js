/*
 * @Author: mwk 
 * @Date: 2017-08-16 23:54:05 
 * @Last Modified by:   mwk 
 * @Last Modified time: 2017-08-16 23:54:05 
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import styles from "./Styles/StockWatchStyle";

export default class StockWatch extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text>StockWatch Component</Text>
      </View>
    );
  }
}
