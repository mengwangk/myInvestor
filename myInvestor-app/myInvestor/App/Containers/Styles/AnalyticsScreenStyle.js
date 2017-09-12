/*
 * @Author: mwk 
 * @Date: 2017-08-13 15:05:39 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-11 16:54:52
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.snow
  },
  row: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginVertical: Metrics.smallMargin
  },
  boldLabel: {
    fontWeight: "bold",
    color: Colors.text
  },
  label: {
    color: Colors.text
  },
  listContent: {
    paddingTop: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin * 8
  }
});
