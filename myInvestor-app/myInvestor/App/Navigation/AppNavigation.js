import { StackNavigator } from "react-navigation";
import HomeScreen from "../Containers/HomeScreen";
import WatchlistScreen from "../Containers/WatchlistScreen";
import SettingsScreen from "../Containers/SettingsScreen";
import LaunchScreen from "../Containers/LaunchScreen";

import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    WatchlistScreen: { screen: WatchlistScreen },
    SettingsScreen: { screen: SettingsScreen },
    LaunchScreen: { screen: LaunchScreen }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "HomeScreen",
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

export default PrimaryNav;
