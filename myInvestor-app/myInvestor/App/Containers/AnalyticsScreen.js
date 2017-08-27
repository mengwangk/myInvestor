import React, { Component } from "react";
import I18n from "react-native-i18n";
import {
  View,
  ListView,
  Text,
  TouchableOpacity,
  Alert,
  TouchableNativeFeedback
} from "react-native";
import { debounce, once } from "lodash";
import { connect } from "react-redux";
import FixtureApi from "../Services/FixtureApi";
import StockListScreen from "./StockListScreen";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import styles from "./Styles/AnalyticsScreenStyle";
import { Colors } from "../Themes";

class AnalyticsScreen extends Component {
  /*
   * Constructor.
  */
  constructor(props) {
    super(props);
    this.state = {};

    // https://stackoverflow.com/questions/43392100/disable-touchableopacity-button-after-oneclick-in-react-native
    // this.selectMarket = once(this.selectMarket.bind(this));
    this.selectMarket = debounce(this.selectMarket.bind(this), 1000, {
      leading: true,
      trailing: false
    });
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
    navigate("StockListScreen");
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
      <TouchableNativeFeedback
        delayPressIn={0}
        delayPressOut={0}
        onPress={() => this.selectMarket(rowData.exchangeName)}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <View style={styles.row}>
          <Text style={styles.boldLabel}>
            {rowData.exchangeName}
          </Text>
          <Text style={styles.label}>
            {rowData.description}
          </Text>
        </View>
      </TouchableNativeFeedback>
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
