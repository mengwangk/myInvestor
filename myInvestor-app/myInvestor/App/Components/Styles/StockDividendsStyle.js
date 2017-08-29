/*
 * @Author: mwk 
 * @Date: 2017-08-29 09:20:45 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-29 09:37:26
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderBottomColor: Colors.steel,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: Metrics.marginLeft,
    marginRight: Metrics.marginRight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  year: {
    flex: 3
  },
  dividend: {
    flex: 3
  },
  yield: {
    flex: 3
  },
  footer: {
    flex:1,
    flexDirection:"row",
    justifyContent: "center"
  },
  text: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.medium,
    color: Colors.snow,
    textAlign: "left",
    marginTop: Metrics.marginTop,
    marginBottom: Metrics.marginBottom,
    marginRight: Metrics.marginRight
  }
});
