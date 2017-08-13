/*
 * @Author: mwk 
 * @Date: 2017-08-12 13:23:18 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-13 12:11:16
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles/StockCellStyle";

export default class StockCell extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    pe: PropTypes.number,
    onSelectStock: PropTypes.func
  };

  render() {
    return (
      <TouchableOpacity style={styles.row} onPress={() => this.props.onSelectStock()}>
        <Text style={styles.boldLabel}>
          {this.props.symbol} - {this.props.name}
        </Text>
        <Text style={styles.label} />
      </TouchableOpacity>
    );
  }
}
