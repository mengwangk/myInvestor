/*
 * @Author: mwk 
 * @Date: 2017-08-24 00:00:16 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 20:58:55
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import styles from "./Styles/StockNewsPageStyle";

export default class StockNewsPage extends Component {
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
        <Text style={styles.contentText}>StockNewsPage Component</Text>
      </View>
    );
  }
}
