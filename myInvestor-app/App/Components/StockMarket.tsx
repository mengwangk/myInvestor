/*
 * @Author: mwk 
 * @Date: 2017-09-12 16:27:16 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-13 23:44:34
 */
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Animated
} from "react-native";
import styles from "./Styles/StockMarketStyle";
import Flag from "react-native-flags";
import { Metrics } from "../Themes/";
import StockMarketInfo from './StockMarketInfo';

// https://github.com/Microsoft/TypeScript-React-Native-Starter
interface StockMarketProps {
  exchangeName?: string;
  description?: string;
  stockCount?: number;
  countryCode?: string;
  onPress?: () => void;
}

interface StockMarketState {
  animatedSize: Animated.Value;
}

export default class StockMarket extends React.Component<StockMarketProps,StockMarketState> {
  constructor(props) {
    super(props);
    this.state = {
      animatedSize: new Animated.Value(1)
    };
  }

  handlePressIn = () => {
    Animated.spring(this.state.animatedSize, {
      toValue: 1.05,
      useNativeDriver: true
    }).start();
  };

  handlePressOut = () => {
    Animated.spring(this.state.animatedSize, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true
    }).start();
  };

  render() {
    const { exchangeName, description, stockCount, countryCode } = this.props;

    const animatedStyle = {
      transform: [{ scale: this.state.animatedSize }]
    };

    const containerStyles = [styles.container, animatedStyle];

    return (
      <View>
        <TouchableWithoutFeedback
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          onPress={this.props.onPress}
        >
          <Animated.View style={containerStyles}>
            <View style={styles.info}>
              <View style={styles.infoText}>
                <Text style={styles.name}>{exchangeName}</Text>
                <Text style={styles.title}>{description}</Text>
              </View>
              <Flag style={styles.avatar} code={countryCode} size={Metrics.avatar} />
            </View>
            <StockMarketInfo
              stockCount={stockCount}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
