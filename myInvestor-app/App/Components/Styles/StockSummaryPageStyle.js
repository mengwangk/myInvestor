/*
 * @Author: mwk 
 * @Date: 2017-08-25 17:19:38 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-25 17:20:21
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Colors, Metrics, Fonts } from "../../Themes/";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginLeft: Metrics.marginLeft,
    marginRight: Metrics.marginRight,
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.steel,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  contentText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    color: Colors.snow,
    textAlign: "left",
    marginTop: Metrics.marginTop,
    marginBottom: Metrics.marginBottom,
    marginRight: Metrics.marginRight
  }
});
