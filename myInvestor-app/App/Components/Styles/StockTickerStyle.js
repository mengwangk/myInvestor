import { StyleSheet } from "react-native";
import { ApplicationStyles, Metrics, Colors, Fonts } from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderBottomColor: Colors.steel,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stock: {
    flex: 1,
    backgroundColor: Colors.background,
    marginLeft: Metrics.marginLeft,
    marginRight: Metrics.marginRight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'  
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
    marginBottom: Metrics.marginBottom
  },
  changeGreen: {
    backgroundColor: Colors.emerald,
    flex: 2,
    padding: 5,
    borderRadius: 3,
    marginBottom: Metrics.marginBottom
  },
  changeText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    color: Colors.snow,
    textAlign: 'center',
  }
});
