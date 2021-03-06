import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "../../Themes/";

export default StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.doubleBaseMargin,
    opacity: 0.7
  },
  info: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Metrics.doubleBaseMargin,
    borderTopLeftRadius: Metrics.cardRadius,
    borderTopRightRadius: Metrics.cardRadius,
    //borderBottomLeftRadius: Metrics.cardRadius,
    //borderBottomRightRadius: Metrics.cardRadius,
    backgroundColor: Colors.snow
  },
  infoText: {
    flex: 1,
    paddingRight: Metrics.doubleBaseMargin
  },
  title: {
    fontFamily: Fonts.type.bold,
    fontSize: 17,
    color: Colors.darkPurple,
    letterSpacing: 0
  },
  name: {
    fontFamily: Fonts.type.base,
    fontSize: 14,
    color: Colors.lightText,
    letterSpacing: 0,
    lineHeight: 18
  },
  avatar: {
    width: Metrics.images.avatar,
    height: Metrics.images.avatar,
    borderColor: Colors.avatarBorder,
    borderWidth: 0
    //borderRadius: Metrics.images.avatar / 2
  }
});
