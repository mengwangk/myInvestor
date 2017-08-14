/*
 * @Author: mwk 
 * @Date: 2017-08-12 13:23:18 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-14 15:38:56
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles/StockCellStyle";
import { ApplicationStyles, Metrics, Colors } from "../Themes";

const accessibilityTraits = ["button"];

export default class StockCell extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    pe: PropTypes.number,
    onSelectStock: PropTypes.func,
    isChecked: PropTypes.bool
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        accessibilityTraits={accessibilityTraits}
        onPress={() => this.props.onSelectStock()}
      >
        <Text style={styles.title}>
          {this.props.symbol} - {this.props.name}
        </Text>
        <View style={styles.checkbox} />
      </TouchableOpacity>
    );
  }
}
