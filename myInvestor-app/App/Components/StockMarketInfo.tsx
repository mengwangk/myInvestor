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
