/*
 * @Author: mwk 
 * @Date: 2017-08-12 13:23:18 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-15 17:38:15
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles/StockCellStyle";
import { ApplicationStyles, Metrics, Colors } from "../Themes";
import CheckBox from "../Components/CheckBox";

export default class StockCell extends Component {
  static propTypes = {
    stock: PropTypes.object,
    isChecked: PropTypes.bool,
    onSelectStock: PropTypes.func,
    onShowDetails: PropTypes.func
  };

  state: {
    isChecked: boolean
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({ isChecked: this.props.isChecked });
  }

  toggleStock(stock) {
    var value = !this.state.isChecked;
    this.setState({ isChecked: value });
    this.props.onSelectStock(value, stock);
  }

  render() {
    const { stock, onSelectStock, onShowDetails } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.stock}
            onPress={() => onShowDetails()}
          >
            <Text style={styles.title}>
              {stock.stockSymbol} - {stock.stockName}
            </Text>
          </TouchableOpacity>
        </View>
        <CheckBox
          isChecked={this.state.isChecked}
          onToggle={this.toggleStock.bind(this, stock)}
        />
      </View>
    );
  }
}
