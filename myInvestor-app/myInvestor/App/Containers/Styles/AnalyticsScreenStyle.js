import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  row: {
    width: Metrics.screenWidth / 2  - Metrics.doubleBaseMargin,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: Metrics.baseMargin,
    backgroundColor: Colors.cloud,
    borderRadius: Metrics.smallMargin
  },
  sectionHeader: {
    paddingTop: Metrics.doubleBaseMargin,
    width: Metrics.screenWidth,
    alignSelf: "center",
    margin: Metrics.baseMargin,
    backgroundColor: Colors.background
  },
  boldLabel: {
    fontWeight: "bold",
    fontSize: Fonts.size.h5,
    alignSelf: "center",
    color: Colors.snow,
    textAlign: "center",
    marginBottom: Metrics.smallMargin
  },
  label: {
    alignSelf: "center",
    color: Colors.snow,
    textAlign: "center"
  },
  listContent: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
