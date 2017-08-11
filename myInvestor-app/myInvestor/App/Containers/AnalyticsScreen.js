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
  /*
   * Constructor.
  */
  constructor(props) {
    super(props);
  }

  updateMarkets() {
    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({
      rowHasChanged
    });
    this.setState({
      markets: this.props.markets,
      dataSource: this.ds.cloneWithRows(this.props.markets)
    });
  }

  selectMarket() {
    const { navigate } = this.props.navigation;
    navigate("StockPickerScreen");
  }

  componentWillMount() {
    this.updateMarkets();
  }

  componentDidUpdate() {
    // https://stackoverflow.com/questions/38000667/react-native-force-listview-re-render-when-data-has-not-changed
    if (this.state.markets != this.props.markets) {
      this.updateMarkets();
    }
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={this.selectMarket.bind(this)}
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
    markets: state.stock.data
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen);
