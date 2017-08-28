/*
 * @Author: mwk 
 * @Date: 2017-08-27 14:58:15 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-27 16:01:13
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, ListView, RefreshControl, ScrollView } from "react-native";
import styles from "./Styles/StockDividendsStyle";

export default class StockDividends extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dividends: this.props.dividends,
      dataSource: ds.cloneWithRows(this.props.dividends),
      refreshing: this.props.refreshing,
      key: Math.random()
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.refreshing !== newProps.refreshing) {
      this.setState({ refreshing: newProps.refreshing });
    }

    if (newProps.dividends) {
      this.setState({ dividends: newProps.dividends });
      this.setState(prevState => ({
        dataSource: prevState.dataSource.cloneWithRows(newProps.dividends)
      }));
    }
  }

  renderRow(dividend) {
    console.log(JSON.stringify(dividend));
    return (
      <View style={styles.dividend}>
        <View style={styles.symbol}>
          <Text style={styles.symbolText}>
            {stock.stockSymbol}
          </Text>
        </View>
        <View style={styles.price}>
          <Text style={styles.priceText}>1.40</Text>
        </View>
      </View>
    );
  }

  onRefresh() {
    this.setState({ refreshing: true });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.dividendsContent}>
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
          enableEmptySections
          pageSize={15}
        />
      </ScrollView>
    );
  }
}
