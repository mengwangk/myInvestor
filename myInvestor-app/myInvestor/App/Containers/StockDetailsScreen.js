/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:17:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-27 10:57:41
 */
import React, { Component } from "react";
import {
  ListView,
  ScrollView,
  Text,
  View,
  RefreshControl,
  Linking,
  TouchableHighlight,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import StockTicker from "../Components/StockTicker";
import StockSummaryPage from "../Components/StockSummaryPage";
import StockChartPage from "../Components/StockChartPage";
import StockNewsPage from "../Components/StockNewsPage";
import styles from "./Styles/StockDetailsScreenStyle";
import { ApplicationStyles, Metrics, Colors } from "../Themes";
import Icon from "react-native-vector-icons/MaterialIcons";
import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";

const ViewPagerPageSize = 3;

class StockDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //market: this.props.market,
      market: "KLSE", // Testing
      stock: Object.assign({}, this.props.stock),
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      refreshing: false,
      key: Math.random()
    };
  }

  componentWillMount() {
    // Testing
    const { stock } = this.state;
    stock.stockName = "YTL POWER INTERNATIONAL BHD";
    stock.stockSymbol = "YTLPOWR";

    this.props.getStockDividends(
      this.state.market,
      this.state.stock.stockSymbol
    );
  }

  componentWillReceiveProps(newProps) {
    if (this.state.refreshing !== newProps.refreshing) {
      console.log("Refreshing...");
      this.setState({ refreshing: newProps.refreshing });
    }
    if (newProps.dividends) {
      console.log("Dividends ----" + JSON.stringify(newProps.dividends));
      /*
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.stock)
      });
      */
    }
  }

  /*
  renderRow(stock) {
    return (
      <StockTicker stock={stock} watchlistResult={this.state.watchlistResult} />
    );
  }
  */

  renderDotIndicator() {
    return <PagerDotIndicator pageCount={ViewPagerPageSize} />;
  }

  render() {
    /*
     <ListView
            key={this.state.key}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
          />
    */
    // https://github.com/facebook/react-native/issues/4099
    const { stock } = this.state;
    console.log('stock ---' + JSON.stringify(stock));
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.stocksBlock}>
          <StockTicker stock={stock} />
        </View>

        <View style={styles.detailedBlock}>
          <IndicatorViewPager
            style={{ flex: 1 }}
            indicator={this.renderDotIndicator()}
          >
            <View>
              <StockSummaryPage
                stock={this.state.stock}
                watchlistResult={this.state.watchlistResult}
              />
            </View>
            <View>
              <StockChartPage stock={this.state.stock} />
            </View>
            <View>
              <StockNewsPage key={this.state.key} stock={this.state.stock} />
            </View>
          </IndicatorViewPager>
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
    market: state.analytics.selectedMarket,
    stock: state.analytics.selectedStock,
    dividends: state.analytics.dividends,
    refreshing: state.analytics.fetching
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStockDividends: (selectedMarket, selectedStock) =>
      dispatch(
        AnalyticsActions.getStockDividendsRequest(selectedMarket, selectedStock)
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockDetailsScreen);
