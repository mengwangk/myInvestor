/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:17:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-04 12:23:05
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
import StockDividends from "../Components/StockDividends";
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
      //stock: Object.assign({}, this.props.stock),
      stock: Object.assign({}, {}), // Testing
      dividends: [],
      refreshing: false // Testing
      // refreshing: this.props.refreshing
    };
  }

  componentWillMount() {
    // Testing
    const { stock } = this.state;
    stock.stockName = "YTL POWER INTERNATIONAL BHD";
    stock.stockSymbol = "YTLPOWR";

    this.props.getStockDividends(
      this.state.market,
      this.state.stock
    );

    this.props.getStockPriceInfo(
      this.state.market,
      this.state.stock
    );

  }

  componentWillReceiveProps(newProps) {
    if (this.state.refreshing !== newProps.refreshing) {
      this.setState({ refreshing: newProps.refreshing });
    }
    if (newProps.dividends) {
      this.setState({ dividends: newProps.dividends });
    }
  }

  renderDotIndicator() {
    return <PagerDotIndicator pageCount={ViewPagerPageSize} />;
  }

  render() {
    // https://github.com/facebook/react-native/issues/4099
    const { stock } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.stockContent}>
          <StockTicker stock={stock} />
        </View>

        <View style={styles.dividendsContent}>
          <StockDividends
            dividends={this.state.dividends}
            refreshing={this.state.refreshing}
          />
        </View>

        <View style={styles.detailsContent}>
          <ScrollView contentContainerStyle={styles.detailsContent}>
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
          </ScrollView>
        </View>
      </View>
    );
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
      ),
    getStockPriceInfo: (selectedMarket, selectedStock) =>
      dispatch(
        AnalyticsActions.getStockPriceInfoRequest(selectedMarket, selectedStock)
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockDetailsScreen);
