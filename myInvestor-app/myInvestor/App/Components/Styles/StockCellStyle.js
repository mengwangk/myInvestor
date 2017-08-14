/*
 * @Author: mwk 
 * @Date: 2017-08-14 14:31:57 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-14 16:06:48
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  container: {
    marginVertical: Metrics.tinyMargin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cloud
  },
  checkbox: {
    width: Metrics.controls.checkBoxSize,
    height: Metrics.controls.checkBoxSize,
    //borderRadius: Metrics.controls.checkBoxSize / 2,
    marginRight: Metrics.marginRight
  },
  title: {
    ...Fonts.style.normal,
    marginLeft: Metrics.smallMargin,
    color: Colors.snow,
    flex: 1
  },
  checkBoxUnchecked: {
    borderColor: Colors.snow,
    borderWidth: Metrics.controls.checkBoxBorderWidth
  },
  checkBoxChecked: Colors.facebook
});
