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
    return (
      <View style={styles.container}>
        <View style={styles.year}>
          <Text style={styles.text}>
            {dividend.dividendYear}
          </Text>
        </View>
        <View style={styles.dividend}>
        <Text style={styles.text}>{dividend.dividend}</Text>
      </View>
      <View style={styles.yield}>
        <Text style={styles.text}>{dividend.dividendYield}</Text>
      </View>
      </View>
    );

    return null;
  }

  onRefresh() {
    this.setState({ refreshing: true });
  }

  renderHeader() {
    return (
      <View style={styles.container}>
        <View style={styles.year}>
          <Text style={styles.text}>Year</Text>
        </View>
        <View style={styles.dividend}>
          <Text style={styles.text}>Dividend</Text>
        </View>
        <View style={styles.yield}>
          <Text style={styles.text}>Yield</Text>
        </View>
      </View>
    );
  }

  renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.text}>
          Yield calculated on current price of 1.42
        </Text>
      </View>
    );
  };

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
          renderFooter={this.renderFooter}
          renderHeader={this.renderHeader}
          enableEmptySections          
          pageSize={15}
        />
      </ScrollView>
    );
  }
}
