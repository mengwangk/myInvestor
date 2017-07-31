import { DrawerNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from '../Containers/HomeScreen';
import WatchlistScreen from '../Containers/WatchlistScreen';
import SettingsScreen from '../Containers/SettingsScreen';
import LaunchScreen from '../Containers/LaunchScreen';
import SampleContainer from '../Containers/SampleContainer';
import SampleScreen from '../Containers/SampleScreen';

import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = DrawerNavigator(
  {
    HomeScreen: { screen: HomeScreen },
    WatchlistScreen: { screen: WatchlistScreen },
    SettingsScreen: { screen: SettingsScreen },
    LaunchScreen: { screen: LaunchScreen },
    SampleContainer: { screen: SampleContainer },
    SampleScreen: { screen: SampleScreen }
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
