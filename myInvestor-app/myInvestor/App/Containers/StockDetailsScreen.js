/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:17:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-13 14:37:41
 */
import React, { Component } from "react";
import { ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import styles from "./Styles/StockDetailsScreenStyle";

class StockDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.boldLabel}>{this.props.stock.stockName}</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
   stock: state.analytics.selectedStock
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StockDetailsScreen);
