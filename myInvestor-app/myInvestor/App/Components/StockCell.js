/*
 * @Author: mwk 
 * @Date: 2017-08-12 13:23:18 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-15 01:00:15
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
    onSelectStock: PropTypes.func
  };

  /*
  static defaultProps = {
    isChecked: false
  };
  */
  
  constructor(props) {
    super(props);
    this.state = { isSelected: this.props.stock.selected };
  }

  toggleCheckBox(stock) {
    if (stock.selected && stock.selected == true) {
      console.log("setting to false");
      stock.selected = false;
    } else {
      console.log("setting to true");
      stock.selected = true;
    }
    this.setState({ isSelected: stock.selected });
  }

  render() {
    const { stock } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.stock}
            onPress={() => this.props.onSelectStock()}
          >
            <Text style={styles.title}>
              {stock.stockSymbol} - {stock.stockName}
            </Text>
          </TouchableOpacity>
        </View>
        <CheckBox
          isChecked={this.state.isSelected}
          onToggle={this.toggleCheckBox.bind(this, stock)}
        />
      </View>
    );
  }
}
