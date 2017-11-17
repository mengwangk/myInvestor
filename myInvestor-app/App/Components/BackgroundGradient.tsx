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
