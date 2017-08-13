import React, { Component } from "react";
import I18n from "react-native-i18n";
import { View, ListView, Text, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import FixtureApi from "../Services/FixtureApi";
import StockPickerScreen from "./StockPickerScreen";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import styles from "./Styles/AnalyticsScreenStyle";

class AnalyticsScreen extends Component {
  /*
   * Constructor.
  */
  constructor(props) {
    super(props);
    this.state = {};
    this.selectMarket = this.selectMarket.bind(this);
  }

  updateMarkets() {
    const rowHasChanged = (r1, r2) => r1.exchangeName !== r2.exchangeName;
    this.ds = new ListView.DataSource({
      rowHasChanged
    });
    this.setState(prevState => ({
      dataSource: this.ds.cloneWithRows(this.props.markets)
    }));
  }

  selectMarket(market) {
    this.props.setMarket(market);
    const { navigate } = this.props.navigation;
    navigate("StockPickerScreen");
  }

  componentWillMount() {
    this.updateMarkets();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.markets) {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.cloneWithRows(newProps.markets)
      }));
    }
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => this.selectMarket(rowData.exchangeName)}
      >
        <Text style={styles.boldLabel}>
          {rowData.exchangeName}
        </Text>
        <Text style={styles.label}>
          {rowData.description}
        </Text>
      </TouchableOpacity>
    );
  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  renderHeader(data) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.boldLabel}>
          {I18n.t("markets")}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          onLayout={this.onLayout}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    markets: state.analytics.markets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMarket: selectedMarket =>
      dispatch(AnalyticsActions.setMarketRequest(selectedMarket))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen);
