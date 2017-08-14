/*
 * @Author: mwk 
 * @Date: 2017-08-14 14:31:57 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-14 22:51:40
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.cloud
  },
  stock: {
    marginVertical: Metrics.tinyMargin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cloud,
    width: Metrics.screenWidth - Metrics.controls.checkBoxSize - 10
  },
  title: {
    ...Fonts.style.normal,
    marginLeft: Metrics.smallMargin,
    color: Colors.snow
  }
});
