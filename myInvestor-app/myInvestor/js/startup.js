/**
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux'; // TODO Redux
import MyInvestorApp from './MyInvestorApp';

function startup(): ReactClass<{}> {
    // Initialization code here
    console.disableYellowBox = true;

    class Main extends React.Component {
        constructor() {
            super();
        }

        render() {
            return (
                <MyInvestorApp />
            );
        }
    }
    return Main;
}

global.LOG = (...args) => {
    console.log('/------------------------------\\');
    console.log(...args);
    console.log('\\------------------------------/');
    return args[args.length - 1];
};

module.exports = startup;