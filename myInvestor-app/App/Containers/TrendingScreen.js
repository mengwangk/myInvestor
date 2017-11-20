import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import {TabNavigator} from 'react-navigation';

// Add Actions - replace 'Your' with whatever your reducer is called :) import
// YourActions from '../Redux/YourRedux' Styles
import styles from './Styles/TrendingScreenStyle';

class TrendingScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Trending'
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>TrendingScreen Container</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TrendingScreen);
