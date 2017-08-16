/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:42:56 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-16 23:45:42
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Colors, Metrics, Fonts } from "../../Themes/";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Colors.background
  },
  stocksBlock: {
    flexDirection: "column",
    flex: 9
  },
  detailedBlock: {
    flex: 5,
    backgroundColor: "#202020",
    justifyContent: "space-between"
  },
  footerBlock: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#202020",
    alignItems: "center",
    paddingLeft: Metrics.marginLeft,
    paddingRight: Metrics.marginRight
  },
  loadingText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 10,
    marginRight: 10,
    color: Colors.snow
  }
});
