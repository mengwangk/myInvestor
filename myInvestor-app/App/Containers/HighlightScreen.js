import React, {Component} from 'react';
import {ScrollView, Text, View, Image, Button} from 'react-native';
import {connect} from 'react-redux';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import I18n from "react-native-i18n";

// Add Actions - replace 'Your' with whatever your reducer is called :) 
// import YourActions from '../Redux/YourRedux' Styles
import styles from './Styles/HighlightScreenStyle';

class HighlightScreen extends Component {

  static navigationOptions = {
    tabBarLabel:  I18n.t("highlightScreen")
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>HighlightScreen Container</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(HighlightScreen);
