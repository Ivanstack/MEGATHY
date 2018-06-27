/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";

import * as constant from "../../../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Libs
// import CollapsibleList from "react-native-collapsible-list";
import SegmentedControlTab from "react-native-segmented-control-tab";

// Device Info
var DeviceInfo = require("react-native-device-info");

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// Variable

class SelectTimeScreen extends Component {
  constructor(props) {
    super(props);

    baseLocal.locale = global.currentAppLanguage;
    this.layoutStore = [];
    this.state = {
      arrTimeSlote: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      crntSelectedSegment: 0
    };

    this.numberOfVisibleItems = 1;
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              // console.log("Nav Params :==> ",navigation.state.params);
              if (
                navigation.state.params != undefined &&
                navigation.state.params.category != undefined
              ) {
                navigation.goBack();
              } else {
                navigation.navigate("DrawerToggle");
              }
            }}
          >
            <Icon
              name={
                navigation.state.params != undefined &&
                navigation.state.params.category != undefined
                  ? "arrow-left"
                  : "navicon"
              }
              style={{ marginLeft: 10 }}
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}> Meghathy </Text>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#CF2526"
    }
  });

  _keyExtractor = (item, index) => item.toString();

  componentDidMount() {}

  _getAPIGetOrderTimeSession = () => {
    var orderTimeSessionParameters = {
      // city_id: global.cu
    };

    networkUtility
      .getRequest(constant.APIGetOrderTimeSession, orderTimeSessionParameters)
      .then(
        result => {
          // Hide Loading View
          // this.setState({ visible: false });

          let resultData = result.data.data;
        },
        error => {
          constants.debugLog("\nStatus Code: " + error.status);
          constants.debugLog("\nError Message: " + error);

          // Hide Loading View
          // this.setState({ visible: false });

          if (error.status != 500) {
            if (
              global.currentAppLanguage === constant.languageArabic &&
              error.data["messageAr"] != undefined
            ) {
              CommonUtilities.showAlert(error.data["messageAr"], false, "Megathy");
            } else {
              CommonUtilities.showAlert(error.data["message"], false, "Megathy");
            }
          } else {
            constants.debugLog("Internal Server Error: " + error.data);
            CommonUtilities.showAlert("Opps! something went wrong");
          }
        }
      );
  };

  // OnPress Methods

  _onPressSegmentChange = index => {
    this.setState({
      crntSelectedSegment: index
    });
  };

  // Render Methods
  _renderTagItem = ({ item, index }) => {
    return (
      <Animated.View style={styles.tagBtnStyle}>
        <Text style={styles.headerText}>
          {index + 1}.{item}
        </Text>
      </Animated.View>
    );
  };

  _renderItem = ({ item, index }) => {
    console.log("Item Array :===> ", this.layoutStore);

    return (
      <View
        // onLayout={this._itemLayout}
        style={{
          flex: 1
          //   justifyContent: 'center',
          //   alignItems: 'center',
        }}
      >
        {/* <CollapsibleList
          numberOfVisibleItems={1}
          //   wrapperStyle={styles.wrapperCollapsibleList}
          buttonContent={
            <View style={[styles.tagBtnStyle, { width: "95%" }]}>
              <Text style={styles.headerStyle}> {item} </Text>
            </View>
          }
          items={[
            <View style={styles.collapsibleItem} />,
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: "#CCC",
                paddingBottom: 10
              }}
            >
              <FlatList
                keyExtractor={this._keyExtractor}
                extraData={this.state}
                // initialNumToRender={dataSource.length || 0}
                // getItemLayout={this._getItemLayout}
                data={this.state.arrTimeSlote}
                horizontal={false}
                renderItem={this._renderTagItem}
                numColumns={3}
              />
            </View>,
            <View style={styles.collapsibleItem} />
          ]}
        /> */}
      </View>
    );
  };

  render() {
    return (
      // Main View (Container)
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          {/* ----- Segment View ----- */}
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            <SegmentedControlTab
              tabsContainerStyle={styles.tabsContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={{ color: constant.themeColor }}
              activeTabStyle={styles.activeTabStyle}
              borderRadius={0}
              values={["First", "Second", "Third", "Fourth"]}
              selectedIndex={this.state.crntSelectedSegment}
              onTabPress={this._onPressSegmentChange}
            />
          </ScrollView>

          {/* ----- Time Slote View ----- */}
          <FlatList
            style={{ width: "100%" }}
            keyExtractor={this._keyExtractor}
            extraData={this.state}
            // initialNumToRender={dataSource.length || 0}
            ref={flatList => {
              this.timeslote = flatList;
            }}
            // getItemLayout={this._getItemLayout}
            data={this.state.arrTimeSlote}
            // horizontal={false}
            renderItem={this._renderItem}
          />
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    firstComp: state.dataReducer.firstComp
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectTimeScreen);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center"
    // backgroundColor: "#CF2526",
  },
  fbButtonStyle: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EAEAEA",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  tagBtnStyle: {
    width: Dimensions.get("window").width / 3 - 11,
    marginTop: 8,
    marginLeft: 8,
    backgroundColor: "lightgray",
    height: 30,
    alignItems: "center",
    justifyContent: "center"
    // borderRadius: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height
  },
  headerText: {
    color: "white",
    margin: 4,
    fontSize: 15,
    fontFamily: constant.themeFont
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    height: 0,
    padding: 1
  },
  wrapperCollapsibleList: {
    flex: 1,
    // marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5
  },
  tabStyle: {
    width: Dimensions.get("window").width / 2,
    borderColor: constant.themeColor,
    borderWidth: 2
  },

  activeTabStyle: {
    width: Dimensions.get("window").width / 2,
    backgroundColor: constant.themeColor,
    borderWidth: 2
  },
  tabsContainerStyle: {
    width: "100%",
    height: 35
    // padding:4
  }
});
