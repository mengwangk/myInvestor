/*
 * @Author: mwk 
 * @Date: 2017-08-08 16:28:08 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-08 16:43:55
 */
import React from "react";
import * as ReactNavigation from "react-navigation";
import { connect } from "react-redux";
import AppNavigation from "./AppNavigation";
import { BackHandler } from "react-native";

// here is our redux-aware our smart component
class ReduxNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      function() {
        const { dispatch, navigation, nav } = this.props;
        if (nav.routes.length === 1) {
          return false;
        }
        dispatch({ type: "Navigation/BACK" });
        return true;
      }.bind(this)
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress");
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = ReactNavigation.addNavigationHelpers({
      dispatch,
      state: nav
    });
    return <AppNavigation navigation={navigation} />;
  }
}

const mapStateToProps = state => ({ nav: state.nav });
export default connect(mapStateToProps)(ReduxNavigation);
