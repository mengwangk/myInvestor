import React, { Component } from "react";
import I18n from "react-native-i18n";
import {
  View,
  ListView,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert
} from "react-native";
import { connect } from "react-redux";
import FixtureApi from "../Services/FixtureApi";
import StockPickerScreen from "./StockPickerScreen";
import styles from "./Styles/AnalyticsScreenStyle";

class AnalyticsScreen extends Component {
  constructor(props) {
    super(props);
    const markets = FixtureApi.getMarkets().data;
    const rowHasChanged = (r1, r2) => r1 !== r2;
    // DataSource configured
    this.ds = new ListView.DataSource({
      rowHasChanged
    });

    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRows(markets)
    };
  }

  selectMarket() {
    const { navigate } = this.props.navigation;
    navigate("StockPickerScreen");
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity style={styles.row} onPress={this.selectMarket.bind(this)}>
        <Text style={styles.boldLabel}>
          {rowData.symbol}
        </Text>
        <Text style={styles.label}>
          {rowData.name}
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
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen);
