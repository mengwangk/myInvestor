/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:17:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 21:47:16
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
  static propTypes = {
    stock: PropTypes.object,
    dividends: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      stock: [Object.assign({}, this.props.stock)],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
      refreshing: false,
      key: Math.random()
    };
  }

  componentWillMount() {
    /*
    const { stock } = this.state;
    stock[0].stockName = "YTL POWER INTERNATIONAL BHD";
    stock[0].stockSymbol = "YTLPOWR";
    */
    console.log("stock --" + JSON.stringify(this.state.stock));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.stock)
    });
  }

  renderRow(stock) {
    return (
      <StockTicker stock={stock} watchlistResult={this.state.watchlistResult} />
    );
  }

  renderDotIndicator() {
    return <PagerDotIndicator pageCount={ViewPagerPageSize} />;
  }

  render() {
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
            renderRow={this.renderRow.bind(this)}
          />
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
    stock: state.analytics.selectedStock,
    dividends: state.analytics.dividends
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StockDetailsScreen);
