import { Dimensions } from "react-native";
import Orientation from "react-native-orientation";

const { height, width } = Dimensions.get("window");
let screen = { height: height, width: width };

Orientation.addOrientationListener(orientation => {
  const { height, width } = Dimensions.get("window");
  const min = Math.min(height, width);
  const max = Math.max(height, width);
  const isLandscape = orientation === "LANDSCAPE";
  screen = {
    height: isLandscape ? min : max,
    width: isLandscape ? max : min
  };
  console.log(JSON.stringify(screen));
});

export default screen;
