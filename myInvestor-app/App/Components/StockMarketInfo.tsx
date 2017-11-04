/*
 * @Author: mwk 
 * @Date: 2017-09-13 00:16:21 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-14 00:35:06
 */
import React, { Component } from "react";
import { View, Text } from "react-native";
import styles from "./Styles/StockMarketInfoStyle";
import I18n from "react-native-i18n";

interface StockMarketInfoProps {
  stockCount: number;
}

const StockMarketInfo = (props: StockMarketInfoProps) => {
  const { stockCount } = props;
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.detailText}>{stockCount} {I18n.t("stockCount")}</Text>
        </View>
      </View>
    </View>
  );
};
export default StockMarketInfo;
