/*
 * @Author: mwk 
 * @Date: 2017-08-05 11:52:40 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-08 11:38:14
 */
import Config from "../Config/DebugConfig";
import Immutable from "seamless-immutable";
import Reactotron from "reactotron-react-native";
import { reactotronRedux as reduxPlugin } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

if (Config.useReactotron) {
  
  // https://github.com/infinitered/reactotron/issues/431
  // https://github.com/infinitered/reactotron for more options!
  Reactotron.configure({  host: 'localhost', name: "myInvestor" })
    .useReactNative()
    .use(reduxPlugin({ onRestore: Immutable }))
    .use(sagaPlugin())
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
}
