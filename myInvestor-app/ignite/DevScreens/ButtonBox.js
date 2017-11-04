/*
 * @Author: mwk 
 * @Date: 2017-08-09 23:03:36 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-09 23:04:15
 */
import React from "react";
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, Image } from "react-native";
import styles from "./Styles/ButtonBoxStyles";

export default class ButtonBox extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    text: PropTypes.string
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
      >
        <Image
          resizeMode="contain"
          source={this.props.image}
          style={styles.image}
        />
        <Text style={styles.label}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}
