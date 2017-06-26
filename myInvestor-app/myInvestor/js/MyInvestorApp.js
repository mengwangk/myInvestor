/**
 * @flow
 */

'use strict';

var React = require('React');
var AppState = require('AppState');
var StyleSheet = require('StyleSheet');
var MyInvestorNavigator = require('./MyInvestorNavigator');
var View = require('View');
var StatusBar = require('StatusBar');

var MyInvestorApp = React.createClass({
    componentDidMount: function () {
        AppState.addEventListener('change', this.handleAppStateChange);
    },

    componentWillUnmount: function () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    },

    handleAppStateChange: function (appState) {
        if (appState === 'active') { }
    },

    render: function () {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0.2)"
                    barStyle="light-content"
                />
                <MyInvestorNavigator />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

module.exports = MyInvestorApp;