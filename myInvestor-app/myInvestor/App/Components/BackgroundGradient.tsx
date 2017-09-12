/*
 * @Author: mwk 
 * @Date: 2017-09-10 15:42:49 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-12 15:55:54
 */
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../Themes";

export default props => {
  const gradient = [Colors.black, Colors.darkBlack];
  return (
    <LinearGradient colors={gradient} style={props.style}>
      {props.children}
    </LinearGradient>
  );
};
