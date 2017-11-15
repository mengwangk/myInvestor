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
