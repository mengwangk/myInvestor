import React, { Component } from "react";
import { View, ListView, Text, Image } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";

// Styles
import styles from "./Styles/HomeScreenStyle";

class HomeScreen extends Component {
  constructor(props) {
    super(props);

   
  }

  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    // ...redux state to props here
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
