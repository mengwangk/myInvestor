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
    const { isChecked, onToggle } = this.props;
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
          onPress={onToggle}
        >
          <View style={[styles.checkbox, style]} />
        </TouchableOpacity>
      </View>
    );
  }
}
