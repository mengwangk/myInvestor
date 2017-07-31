import { StackNavigator } from 'react-navigation'
import SettingsScreen from '../Containers/SettingsScreen'
import WatchlistScreen from '../Containers/WatchlistScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  SettingsScreen: { screen: SettingsScreen },
  WatchlistScreen: { screen: WatchlistScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
