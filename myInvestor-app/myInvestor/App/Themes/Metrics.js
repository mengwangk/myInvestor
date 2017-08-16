/*
 * @Author: mwk 
 * @Date: 2017-08-08 23:51:36 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-16 23:25:02
 */
import { Dimensions, Platform } from "react-native";
import { Colors } from "./Colors";

const { width, height } = Dimensions.get("window");

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  marginRight: 10,
  marginLeft:10,
  marginBottom:10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  tinyMargin: 2,
  doubleSection: 50,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === "ios" ? 64 : 54,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  },
  controls: {
    checkBoxSize: 16,
    checkBoxBorderWidth: 1,
    largeIndicator: 'large'
  }
};

export default metrics;
