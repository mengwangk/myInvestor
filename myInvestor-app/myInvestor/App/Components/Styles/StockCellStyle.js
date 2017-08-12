import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  row: {
    flex: 1,
    backgroundColor: Colors.cloud,
    marginVertical: Metrics.tinyMargin,
    justifyContent: "center"
  },
  boldLabel: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.snow,
    textAlign: "left",
    marginLeft: Metrics.smallMargin,
    marginBottom: Metrics.tinyMargin
  },
  label: {
    textAlign: "left",
    color: Colors.snow
  }
});
