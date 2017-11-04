/*
 * @Author: mwk 
 * @Date: 2017-08-11 23:47:50 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-27 00:47:56
 */
import React, { Component } from "react";
import { View, Text, ListView, RefreshControl } from "react-native";
import { connect } from "react-redux";
import I18n from "react-native-i18n";
import styles from "./Styles/StockListScreenStyle";
import StockChooser from "../Components/StockChooser";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import { debounce } from "lodash";

class StockListScreen extends Component {
  state: {
    selectedStocks: { [symbol: string]: boolean }
  };

  constructor(props) {
    super(props);
    this.showStockDetails = debounce(this.showStockDetails.bind(this), 3000, {
      leading: true,
      trailing: false
    });
    this.state = {
      selectedStocks: {},
      refreshing: this.props.refreshing
    };
  }

  updateStocks() {
    const rowHasChanged = (r1, r2) => r1.stockSymbol !== r2.stockSymbol;
    const ds = new ListView.DataSource({ rowHasChanged });
    this.setState(prevState => ({
      dataSource: ds.cloneWithRows(this.props.stocks)
    }));
  }

  showStockDetails(stock) {
    this.props.setStock(stock);
    const { navigate } = this.props.navigation;
    navigate("StockDetailsScreen");
  }

  selectStock(isSelected, stock) {
    var selectedStocks = { ...this.state.selectedStocks };
    if (isSelected) {
      selectedStocks[stock.stockSymbol] = true;
    } else {
      delete selectedStocks[stock.stockSymbol];
    }
    this.setState({ selectedStocks: { ...selectedStocks } });
  }

  renderRow(stock) {
    // https://github.com/facebook/react-native/issues/7233
    return (
      <StockChooser
        stock={stock}
        isChecked={this.state.selectedStocks[stock.stockSymbol]}
        onShowDetails={() => this.showStockDetails(stock)}
        onSelectStock={isSelected => this.selectStock(isSelected, stock)}
      />
    );
  }

  getStocks = async () => {
    this.props.getStocks(this.props.market);
  };

  componentDidMount() {
    this.getStocks();
  }

  componentWillMount() {
    this.updateStocks();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.stocks) {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.cloneWithRows(newProps.stocks),
        refreshing: newProps.refreshing
      }));
    }
  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  
  onRefresh() {
    this.setState({refreshing: true});
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
          pageSize={15}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh().bind(this)}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    stocks: state.analytics.stocks,
    market: state.analytics.selectedMarket,
    refreshing: state.analytics.fetching
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStocks: selectedMarket =>
      dispatch(AnalyticsActions.getStocksRequest(selectedMarket)),
    setStock: selectedStock =>
      dispatch(AnalyticsActions.setStockRequest(selectedStock))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockListScreen);
