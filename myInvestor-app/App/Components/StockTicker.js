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
      <TouchableHighlight style={[styles.container]}>
        <View style={[styles.stock]}>
          <View style={styles.symbol}>
            <Text style={styles.symbolText}>
              {stock.stockSymbol}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>{stock.currentPrice}</Text>
          </View>

          <TouchableHighlight style={styles.changeGreen}>
            <View>
              <Text style={styles.changeText}>
                  {stock.changeInPercent}%
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  }
}
