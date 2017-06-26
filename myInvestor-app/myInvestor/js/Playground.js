/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Playground extends React.Component {
    state: {
        content: Array<ReactElement>;
    };

    constructor() {
        super();
        const content = [];
        const define = (name: string, render: Function) => {
            content.push(<Example key={name} render={render} />);
        };
        var Module = require('MyInvestorHeader');
        // $FlowFixMe: doesn't understand static
        Module.__cards__(define);
        this.state = { content };
    }

    render() {
        return (
            <View style={{ backgroundColor: '#336699', flex: 1, }}>
                {this.state.content}
            </View>
        );
    }
}

class Example extends React.Component {
    state = {
        inner: null
    };

    render() {
        const content = this.props.render(this.state.inner, (inner) => this.setState({ inner }));
        return (
            <View>
                {content}
            </View>
        );

    }
}

module.exports = Playground;
