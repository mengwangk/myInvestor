/*
 * @Author: mwk 
 * @Date: 2017-08-30 23:55:51 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-31 00:12:42
 */
import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";
import { Provider } from "react-redux";
import RootContainer from "./RootContainer";
import createStore from "../Redux";

// create our store
const store = createStore();

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}

// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(App) : App);
