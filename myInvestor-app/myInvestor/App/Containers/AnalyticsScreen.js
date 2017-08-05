import React, { Component } from "react";
import I18n from "react-native-i18n";
import {
  View,
  ListView,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert
} from "react-native";
import { connect } from "react-redux";
import FixtureApi  from "../Services/FixtureApi";

// For empty lists
// import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from "./Styles/AnalyticsScreenStyle";

class AnalyticsScreen extends Component {
  constructor(props) {
    super(props);

    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    const dataObjects = FixtureApi.getMarkets().data;
    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *   The same goes for sectionHeaderHasChanged
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2;

    // DataSource configured
    this.ds = new ListView.DataSource({
      rowHasChanged
    });

    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRows(dataObjects)
    };
  }

  selectMarket() {
    Alert.alert("afsdf", "Afsdfs");
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow(rowData) {
    return (
      <TouchableOpacity style={styles.row} onPress={this.selectMarket}>
        <Text style={styles.boldLabel}>
          {rowData.symbol}
        </Text>
        <Text style={styles.label}>
          {rowData.name}
        </Text>
      </TouchableOpacity>
    );
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRowsAndSections` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState(prevState => ({
          dataSource: prevState.dataSource.cloneWithRowsAndSections(newProps.someData)
        }))
      }
    }
  *************************************************************/

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  renderHeader(data) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.boldLabel}>
          {I18n.t("markets")}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          onLayout={this.onLayout}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    // ...redux state to props here
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen);
