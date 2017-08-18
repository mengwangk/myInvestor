/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:17:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-18 09:37:37
 */
import React, { Component } from "react";
import { ListView, ScrollView, Text, View, RefreshControl } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import StockWatch from "../Components/StockWatch";
import styles from "./Styles/StockDetailsScreenStyle";

class StockDetailsScreen extends Component {
  static propTypes = {
    stock: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedStock: [Object.assign({}, this.props.stock)],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
      refreshing: true,
      key: Math.random()
    };
  }

  componentWillMount() {
    const { selectedStock } = this.state;
    selectedStock[0].stockName = "YTL POWER INTERNATIONAL BHD";
    selectedStock[0].stockSymbol = "YTLPOWR";
    console.log("stock ===" + JSON.stringify(selectedStock));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.selectedStock)
    });
  }

  render() {
    console.log('state ---' + JSON.stringify(this.state));
    // https://github.com/facebook/react-native/issues/4099
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.stocksBlock}>
          <ListView
            key={this.state.key}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            dataSource={this.state.dataSource}
            renderRow={stock =>
              <StockWatch
                stock={stock}
                watchlistResult={this.state.watchlistResult}
              />}
          />
        </View>
      </ScrollView>
    );
  }

  onRefresh() {
    this.setState({ refreshing: true });
    // StockActions.updateStocks();
    this.setState({ refreshing: false });
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
