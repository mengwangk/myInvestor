/*
 * @Author: mwk 
 * @Date: 2017-08-16 23:54:05 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 17:13:54
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableHighlight } from "react-native";
import styles from "./Styles/StockTickerStyle";

export default class StockTicker extends Component {
  static propTypes = {
    stock: PropTypes.object,
    watchlistResult: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      stock: this.props.stock
    };
  }

  render() {
    const { stock } = this.state;
    return (
      <TouchableHighlight>
        <View style={[styles.container]}>
          <View style={styles.symbol}>
            <Text style={styles.symbolText}>
              {stock.stockSymbol}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>1.40</Text>
          </View>

          <TouchableHighlight style={styles.changeGreen}>
            <View>
              <Text style={styles.changeText}>
                  +0.71%
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  }
}
