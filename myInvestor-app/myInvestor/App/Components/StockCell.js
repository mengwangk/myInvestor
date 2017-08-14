/*
 * @Author: mwk 
 * @Date: 2017-08-12 13:23:18 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-15 00:21:05
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles/StockCellStyle";
import { ApplicationStyles, Metrics, Colors } from "../Themes";
import CheckBox from "../Components/CheckBox";

const accessibilityTraits = ["button"];

export default class StockCell extends Component {
  static propTypes = {
    stock: PropTypes.object,
    onSelectStock: PropTypes.func,
    isSelected: PropTypes.bool
  };

  render() {
    const { stock } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.stock}
            accessibilityTraits={accessibilityTraits}
            onPress={() => this.props.onSelectStock()}
          >
            <Text style={styles.title}>
              {stock.stockSymbol} - {stock.stockName}
            </Text>
          </TouchableOpacity>
        </View>
        <CheckBox />
      </View>
    );
  }
}
