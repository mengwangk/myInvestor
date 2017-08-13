/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:42:56 
 * @Last Modified by:   mwk 
 * @Last Modified time: 2017-08-13 14:42:56 
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Colors, Metrics } from "../../Themes/";

export default StyleSheet.create({
   ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  boldLabel: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.snow,
    textAlign: "left",
    marginLeft: Metrics.smallMargin,
    marginBottom: Metrics.tinyMargin
  }
});
