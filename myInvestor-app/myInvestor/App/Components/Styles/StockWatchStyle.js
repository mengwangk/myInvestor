/*
 * @Author: mwk 
 * @Date: 2017-08-22 01:03:17 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-08-22 14:25:40
 */
import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginLeft: Metrics.marginLeft,
    marginRight: Metrics.marginRight,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.steel,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selected: {
    backgroundColor: Colors.selected,
  },
  symbol: {
    flex: 3,
  },
  symbolText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    color: Colors.snow,
    textAlign: 'left',
    marginTop: Metrics.marginTop,
    marginBottom: Metrics.marginBottom,
    marginRight: Metrics.marginRight,
  },
  price: {
    flex: 2,
  },
  priceText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    color: Colors.snow,
    textAlign: 'right',
    marginTop: Metrics.marginTop,
    marginBottom: Metrics.marginBottom,
    marginRight: Metrics.marginRight
  },
  changeRed: {
    backgroundColor: Colors.redOrange,
    flex: 2,
    padding: 5,
    borderRadius: 3,
  },
  changeGreen: {
    backgroundColor: Colors.emerald,
    flex: 2,
    padding: 5,
    borderRadius: 3,
  },
  changeText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    color: Colors.snow,
    textAlign: 'center',
  }
});
