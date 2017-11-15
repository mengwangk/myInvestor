import Config from "../Config/DebugConfig";
import Immutable from "seamless-immutable";
import Reactotron from "reactotron-react-native";
import { reactotronRedux as reduxPlugin } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

if (Config.useReactotron) {
  
  console.log("connecting to reactotron");
  
  // https://github.com/infinitered/reactotron/issues/431
  // https://github.com/infinitered/reactotron for more options!
  // https://github.com/infinitered/reactotron/issues/162g
  // Reactotron.configure({  host: 'localhost', name: "myInvestor" })
  // Do adb reverse tcp:9090 tcp:9090
  Reactotron
    .useReactNative()
    .use(reduxPlugin({ onRestore: Immutable }))
    .use(sagaPlugin())
    .connect(
      { 
        enabled: true,
        host: 'localhost',
        port:9090
      }
    );

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
}
