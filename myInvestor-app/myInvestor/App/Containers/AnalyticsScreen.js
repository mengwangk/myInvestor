/*
 * @Author: mwk 
 * @Date: 2017-09-10 15:43:59 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-12 10:11:32
 */
import React, { Component } from "react";
import I18n from "react-native-i18n";
import {
  View,
  ListView,
  Text,
  Alert,
  FlatList,
  Image,
  AppState
} from "react-native";
import { merge, groupWith, contains, assoc, map, sum, findIndex } from "ramda";
import { connect } from "react-redux";
import FixtureApi from "../Services/FixtureApi";
import StockListScreen from "./StockListScreen";
import AnalyticsActions from "../Redux/AnalyticsRedux";
import styles from "./Styles/AnalyticsScreenStyle";
import { Colors } from "../Themes";
import BackgroundGradient from "../Components/BackgroundGradient";

class AnalyticsScreen extends Component {
  /*
   * Constructor.
  */
  constructor(props) {
    super(props);
    const { markets } = props;
    const appState = AppState.currentState;
    this.state = { markets, appState };

    // https://stackoverflow.com/questions/43392100/disable-touchableopacity-button-after-oneclick-in-react-native
    // this.selectMarket = once(this.selectMarket.bind(this));
    /*
    this.selectMarket = debounce(this.selectMarket.bind(this), 1000, {
      leading: true,
      trailing: false
    });
    */
  }

  onMarketPress(market) {
    this.props.setMarket(market);
    const { navigate } = this.props.navigation;
    navigate("StockListScreen");
  }

  componentWillMount() {
    // Do nothing now
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillMount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    const { appState } = this.state;
    this.setState({ appState: nextAppState });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.markets) {
      this.setState(prevState => ({
        markets: newProps.markets
      }));
    }
  }

  /*    
  renderRow(rowData) {
    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        delayPressOut={0}
        onPress={() => this.onMarketPress(rowData.exchangeName)}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.exchangeName}</Text>
          <Text style={styles.label}>{rowData.description}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
  */

  getItemLayout = (data, index) => {
    console.log(JSON.stringify(data));
    const item = data[index];
    const itemLength = (item, index) => {
      // use best guess for variable height rows
      return 138 + (1.002936 * item.exchangeName.length + 6.77378);
    };
    const length = itemLength(item);
    const offset = sum(data.slice(0, index).map(itemLength));
    return { length, offset, index };
  };

  renderItem(item) {
    console.log("render item");
  }

  render() {
    /*
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
    */
    const { markets } = this.state;
    return (
      <BackgroundGradient style={styles.linearGradient}>
        <FlatList
          ref="marketList"
          data={markets}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={(item, idx) => item.exchangeName}
          contentContainerStyle={styles.listContent}
          getItemLayout={this.getItemLayout}
          showsVerticalScrollIndicator={false}
        />
      </BackgroundGradient>
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
