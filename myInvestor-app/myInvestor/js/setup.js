/**
 * @flow
 */
'use strict';

var MyInvestorAppApp = require('MyInvestorApp');
var React = require('React');
var Relay = require('react-relay');

var { Provider } = require('react-redux');

function setup(): ReactClass<{}> {
  console.disableYellowBox = true;
  class Root extends React.Component {
    state: {
      isLoading: boolean;
      store: any;
    };

    constructor() {
      super();
      this.state = {
        isLoading: false,
      };
    }

    render() {
      if (this.state.isLoading) {
        return null;
      }
      return (
        <Provider store={this.state.store}>
          <MyInvestorApp />
        </Provider>
      );
    }
  }

  return Root;
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};

module.exports = setup;
