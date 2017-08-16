/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:17:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-16 16:50:40
 */
import React, { Component } from "react";
import { ScrollView, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import styles from "./Styles/StockDetailsScreenStyle";

class StockDetailsScreen extends Component {
  static propTypes = {
    stock: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedStock: Object.assign({}, this.props.stock)
    };
  }

  componentWillMount() {
    const { selectedStock } = this.state;
    console.log("stock ===" + JSON.stringify(selectedStock));
    selectedStock.stockName = "YTL POWER INTERNATIONAL BHD";
    selectedStock.stockSymbol = "YTLPOWR";
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.boldLabel}>
          {this.state.selectedStock.stockName}
        </Text>
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
