/*
 * @Author: mwk 
 * @Date: 2017-09-13 17:55:23 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-13 23:42:03
 */
import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "../../Themes/";

export default StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: Metrics.doubleBaseMargin,
    borderBottomLeftRadius: Metrics.cardRadius,
    borderBottomRightRadius: Metrics.cardRadius,
    backgroundColor: Colors.silver
  },
  details: {
    flex: 1,
    flexDirection: "row"
  },
  detail: {
    paddingRight: Metrics.doubleBaseMargin
  },
  detailLabel: {
    fontFamily: Fonts.type.base,
    fontSize: 11,
    color: Colors.lightText,
    letterSpacing: 0
  },
  detailText: {
    fontFamily: Fonts.type.semiBold,
    fontSize: 11,
    color: Colors.darkPurple,
    letterSpacing: 0
  }
});
