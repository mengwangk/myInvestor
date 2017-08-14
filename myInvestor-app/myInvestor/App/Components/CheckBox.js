/*
 * @Author: mwk 
 * @Date: 2017-08-14 16:38:25 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-15 00:58:33
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";
import styles from "./Styles/CheckBoxStyle";

export default class CheckBox extends Component {
  static propTypes = {
    isChecked: PropTypes.bool,
    onToggle: PropTypes.func
  };

  render() {
    console.log(JSON.stringify(this.props));
    const { isChecked } = this.props;
     console.log('rendering checkbox --' + isChecked);
    const style = isChecked ? styles.checkBoxChecked : styles.checkBoxUnchecked;
    const accessibilityTraits = ["button"];
    if (isChecked) {
      accessibilityTraits.push("selected");
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.checkbox}
          accessibilityTraits={accessibilityTraits}
          onPress={this.props.onToggle}
        >
          <View style={[styles.checkbox, style]} />
        </TouchableOpacity>
      </View>
    );
  }
}
