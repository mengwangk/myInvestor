/*
 * @Author: mwk 
 * @Date: 2017-08-11 23:47:50 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-12 10:13:45
 */
import React, { Component } from "react";
import { View, Text, ListView } from "react-native";
import { connect } from "react-redux";
import I18n from "react-native-i18n";
import styles from "./Styles/StockPickerScreenStyle";

class StockPickerScreen extends Component {
  state: {
    dataSource: Object
  };

  constructor(props) {
    super(props);
    const rowHasChanged = (r1, r2) => r1 !== r2;
    const ds = new ListView.DataSource({ rowHasChanged });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.stocks)
    };
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow(rowData) {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>
          {rowData.stockSymbol} - {rowData.stockName}
        </Text>
        <Text style={styles.label}>
          
        </Text>
      </View>
    );
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState(prevState => ({
          dataSource: prevState.dataSource.cloneWithRows(newProps.someData)
        }))
      }
    }
  *************************************************************/

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  // Render a footer.
  renderFooter = () => {
    return <Text> - Footer - </Text>;
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
    stocks: state.analytics.stocks
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StockPickerScreen);
