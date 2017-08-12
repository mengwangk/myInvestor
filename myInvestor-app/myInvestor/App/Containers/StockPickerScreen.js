/*
 * @Author: mwk 
 * @Date: 2017-08-11 23:47:50 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-12 13:30:25
 */
import React, { Component } from "react";
import { View, Text, ListView } from "react-native";
import { connect } from "react-redux";
import I18n from "react-native-i18n";
import styles from "./Styles/StockPickerScreenStyle";
import StockCell from "../Components/StockCell";

class StockPickerScreen extends Component {
  state: {
    dataSource: Object
  };

  constructor(props) {
    super(props);
    const rowHasChanged = (r1, r2) => r1.stockSymbol !== r2.stockSymbol;
    const ds = new ListView.DataSource({ rowHasChanged });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.stocks)
    };
  }

  renderRow(rowData) {
    return (
      <StockCell symbol={rowData.stockSymbol} name={rowData.stockName} pe={rowData.currentPE}/>
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.stocks) {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.cloneWithRows(newProps.stocks)
      }));
    }
  }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  // Render a footer.
  renderFooter = () => {
    return <Text> - {this.props.market} - </Text>;
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderFooter={this.renderFooter}
          enableEmptySections
          pageSize={15}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    stocks: state.analytics.stocks,
    market: state.analytics.selectedMarket
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StockPickerScreen);
