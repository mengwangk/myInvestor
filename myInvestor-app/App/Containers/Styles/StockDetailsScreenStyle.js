/*
 * @Author: mwk 
 * @Date: 2017-08-13 14:42:56 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-27 14:49:33
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
  stockContent: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: Colors.background
  },
  dividendsContent: {
    flexDirection: "column",
    flex: 4,
    backgroundColor: Colors.cloud
  },
  detailsContent: {
    flex: 5,
    backgroundColor: Colors.facebook,
    justifyContent: "space-between"
  },
  footerContent: {
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
  },
  yahoo: {
    flex: 1
  },
  yahooText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "left"
  }
});
