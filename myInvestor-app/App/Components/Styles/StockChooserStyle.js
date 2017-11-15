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
    width: Metrics.screenWidth - Metrics.controls.checkBoxSize - 20
  },
  title: {
    ...Fonts.style.normal,
    marginLeft: Metrics.smallMargin,
    color: Colors.snow
  }
});
