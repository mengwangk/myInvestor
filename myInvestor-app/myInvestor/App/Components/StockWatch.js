/*
 * @Author: mwk 
 * @Date: 2017-08-16 23:54:05 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-18 09:36:56
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import styles from "./Styles/StockWatchStyle";

export default class StockWatch extends Component {
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

  componentWillMount() {}

  render() {
    console.log('props --' + JSON.stringify(this.props));
    const { stock } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          {stock.stockName}
        </Text>
      </View>
    );
  }
}
