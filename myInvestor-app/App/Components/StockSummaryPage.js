/*
 * @Author: mwk 
 * @Date: 2017-08-25 17:12:47 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 17:41:05
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { View, Text } from "react-native";
import styles from "./Styles/StockSummaryPageStyle";

export default class StockDetailsPage extends Component {
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
      <View style={[styles.container]}>
        <Text style={styles.contentText}>StockDetailsPage Component</Text>
      </View>
    );
  }
}
