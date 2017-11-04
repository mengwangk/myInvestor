/*
 * @Author: mwk 
 * @Date: 2017-09-10 15:43:59 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-13 17:50:54
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
import StockMarket from "../Components/StockMarket";

class AnalyticsScreen extends Component {
  /*
   * Constructor.
  */
  constructor(props) {
    super(props);
    const { markets } = props;
    const appState = AppState.currentState;
    this.state = { markets, appState };
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

  getItemLayout = (data, index) => {
    const item = data[index];
    const itemLength = (item, index) => {
      // use best guess for variable height rows
      return 138 + (1.002936 * item.exchangeName.length + 6.77378);
    };
    const length = itemLength(item);
    const offset = sum(data.slice(0, index).map(itemLength));
    return { length, offset, index };
  };

  renderItem = ({item}) => {
    return (
      <StockMarket
        exchangeName={item.exchangeName}
        description={item.description}
        stockCount={item.stockCount}
        countryCode={item.countryCode}
        onPress={() => this.onMarketPress(item)}
      />
    );
  }

  render() {
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
