/*
 * @Author: mwk 
 * @Date: 2017-08-03 17:31:29 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-03 17:44:51
 */
import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { View, Text } from "react-native";
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-menu";
import NavigationMenu from "./NavigationMenu";
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
      <MenuContext style={{ flex: 1 }}>
        <NavigationMenu/>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Hello!</Text>
        </View>
      </MenuContext>
    );
  }
}
