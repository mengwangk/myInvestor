/*
 * @Author: mwk 
 * @Date: 2017-09-12 16:27:16 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-12 17:20:21
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
import FadeIn from "react-native-fade-in-image";

interface StockMarketProps {
  exchangeName: string;
  description: string;
  stockCount: number;
  onPress(): void;
}

interface StockMarketState {
  animatedSize: Animated.Value;
}

export default class StockMarket extends Component<StockMarketProps, StockMarketState> {
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
    console.log("props ---" + JSON.stringify(this.props));
    const { exchangeName, description, stockCount } = this.props;

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
                <Text style={styles.name}>{description}</Text>
                <Text style={styles.title}>{exchangeName}</Text>
              </View>
              <FadeIn>
                <Image style={styles.avatar} source={{ uri: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/7/005/04e/008/3cae797.jpg'}} />
              </FadeIn>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
