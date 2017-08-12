/*
 * @Author: mwk 
 * @Date: 2017-08-03 17:31:29 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-04 00:43:45
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Fonts, Colors, Metrics } from "../Themes/";
import styles from "./Styles/NavigationToolbarStyle";

export default class NavigationToolbar extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render() {
    return (
      <Icon.Button name="search" size={Metrics.icons.tiny} backgroundColor={Colors.background} iconStyle={styles.searchButton} onPress={this.searchStock}/>
    );
  }

  searchStock(){
    console.log('searching');
  }


}