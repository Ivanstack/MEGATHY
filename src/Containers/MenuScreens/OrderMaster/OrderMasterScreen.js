/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  Image,
  TouchableOpacity,
  AppState,
  SafeAreaView
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../Helper/CommonStyle";
import * as constant from "../../../Helper/Constants";
import * as commonUtility from "../../../Helper/CommonUtilities";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Swiper from "react-native-swiper";
import StepIndicator from "react-native-step-indicator";
import autobind from "autobind-decorator";

// Network Utility
import * as networkUtility from "../../../Helper/NetworkUtility";

// Components Style
import OrderMasterStyles from "./OrderMasterStyles";

// Screen
import AddressListScreen from "../DeliveryDetails/AddressList/AddressListScreen";
// import AddressListScreen from "../Category/CartScreen/CartScreen";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";

// Variable
const activeIndicatorViewHeight = 20;
const inactiveIndicatorViewHeight = 15;
const labels = ["Select Address", "Select Time", "Payment"];
const classContext = null;
const customStyles = {
  stepIndicatorSize: inactiveIndicatorViewHeight,
  currentStepIndicatorSize: activeIndicatorViewHeight,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 0,
  stepStrokeCurrentColor: "transparent", //constant.themeColor,
  stepStrokeWidth: 0,
  stepStrokeFinishedColor: constant.themeColor,
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: constant.themeColor,
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: constant.themeColor,
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelCurrentColor: constant.themeColor,
  stepIndicatorLabelFinishedColor: constant.themeColor,
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: constant.themeColor
};

class OrderMasterScreen extends Component {
  constructor(props) {
    super(props);
    //Class State
    this.state = {
      currentPosition: 0,
      visible: false,
      storeTime: "",
      storeCurrentTime: "",
      storeCurrentTimeInSeconds: ""
    };
    classContext = this;
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          alignItems: "center"
        }}
      >
        <View style={{ flexDirection: "row", width: "50%", marginLeft: 10 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack(null);
              // classContext.props.cartScrContext.setState({
              //   orderMasterModalVisible: false
              // });
            }}
          >
            <Icon name="close-o" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View>
          {/* {classContext ? (
            <Text style={OrderMasterStyles.headerText}>
              {labels[classContext.statecurrentPosition]}
            </Text>
          ) : ( */}
          <Text style={OrderMasterStyles.headerText}> Select Address </Text>
          {/* )} */}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            justifyContent: "flex-end"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              classContext._onPressBackBtn();
            }}
          >
            <Icon name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              classContext._onPressNextBtn();
            }}
          >
            <Icon name="arrow-right" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: constant.themeColor
    }
  });

  // App Life Cycle Methods
  componentDidMount() {
    console.log("App State: ", AppState.currentState);
    this._getStoreTime();
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
    clearInterval(this.storeCrntTimeInterval);
  }

  componentWillUpdate() {}

  // Mics Methods

  _timerForStoreCurrentTime = () => {
    let getStoreTimeInSecond = this.state.storeCurrentTimeInSeconds;
    if (this.state.storeCurrentTimeInSeconds === "") {
      getStoreTimeInSecond = new Date(this.state.storeTime).getTime(); // Get Time in ms
    }
    getStoreTimeInSecond = getStoreTimeInSecond + 1000;
    let dateFromTimeStamp = new Date(getStoreTimeInSecond).toLocaleTimeString(
      "en-us"
    );
    console.log("Get TimeStemp :======> ", getStoreTimeInSecond);
    console.log(
      "Get storeTime before convert from TimeStemp :======> ",
      dateFromTimeStamp
    );
    this.setState({
      storeCurrentTime: dateFromTimeStamp,
      storeCurrentTimeInSeconds: getStoreTimeInSecond
    });
  };

  _getStoreTime = () => {
    console.log("Call get storeTime .....");

    let storeTime = networkUtility.getRequest(constant.APIGetStoreTimeZone).then(
      result => {
        let responseData = result.data.data;
        console.log("Get storeTime :======> ", responseData);

        let storeCrtTime = responseData.storeTime;
        storeCrtTime = new Date(storeCrtTime).toLocaleTimeString("en-us");
        console.log("Get storeTime after convert :======> ", storeCrtTime);

        // Hide Loading View
        this.setState({
          visible: false,
          storeTime: responseData.storeTime,
          storeCurrentTime: storeCrtTime
        });
        this.storeCrntTimeInterval = setInterval(
          this._timerForStoreCurrentTime,
          1000
        );
      },
      error => {
        constants.debugLog("\nStatus Code: " + error.status);
        constants.debugLog("\nError Message: " + error);

        // Hide Loading View
        this.setState({ visible: false });

        if (error.status != 500) {
          if (
            global.currentAppLanguage === constant.languageArabic &&
            error.data["messageAr"] != undefined
          ) {
            commonUtility.showAlert(error.data["messageAr"], false, "Megathy");
          } else {
            commonUtility.showAlert(error.data["message"], false, "Megathy");
          }
        } else {
          constants.debugLog("Internal Server Error: " + error.data);
          commonUtility.showAlert("Opps! something went wrong");
        }
      }
    );
  };

  _onPageChange(position) {
    console.log("onPageChange position :", position);
    if (position < 0) {
      position = 0;
    }
    this.setState({ currentPosition: position });
  }

  _onPressNextBtn = () => {
    if (this.state.currentPosition < labels.length - 1) {
      this._swiper.scrollBy(1);
    }
  };

  _onPressBackBtn = () => {
    if (this.state.currentPosition > 0) {
      this._swiper.scrollBy(-1);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: constant.darkGrayBGColor
        }}
      >
        <SafeAreaView
          style={{
            flex: 1
          }}
        >
          <View style={OrderMasterStyles.orderActionView}>
            <View style={{ marginTop: 8 }}>
              <StepIndicator
                customStyles={customStyles}
                currentPosition={this.state.currentPosition}
                labels={labels}
                onPress={position => this._onPageChange(position)}
                stepCount={labels.length}
                renderStepIndicator={item => {
                  // console.log("indicator :=> ", item);
                  let source = "";
                  if (item.stepStatus === "current") {
                    source = require("../../../Resources/Images/OrderStatus/CurrentState.png");
                  } else if (item.stepStatus === "finished") {
                    source = require("../../../Resources/Images/OrderStatus/CompleteState.png");
                  } else if (item.stepStatus === "unfinished") {
                    source = require("../../../Resources/Images/OrderStatus/PandingState.png");
                  }
                  return (
                    <View>
                      <Image
                        style={{
                          width:
                            item.stepStatus === "current"
                              ? activeIndicatorViewHeight
                              : inactiveIndicatorViewHeight,
                          height:
                            item.stepStatus === "current"
                              ? activeIndicatorViewHeight
                              : inactiveIndicatorViewHeight
                          // flex: 1,
                        }}
                        source={source}
                      />
                    </View>
                  );
                }}
              />
            </View>
            <View style={{ flex: 1, marginRight: 3, marginTop: 7 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: constant.themeFont,
                  color: constant.themeColor,
                  fontWeight: "bold",
                  alignSelf: "flex-end"
                }}
              >
                Store Current Time : {this.state.storeCurrentTime}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
              //   backgroundColor: "blue",
            }}
          >
            <Swiper
              //   style={OrderMasterStyles.swipeViewWrapper}
              // showPagination
              //   autoplay={true}
              //   autoplayTimeout={3}
              //   autoplayDirection={true}
              ref={swiper => {
                this._swiper = swiper;
              }}
              loop={false}
              index={this.state.currentPosition}
              onIndexChanged={index => this._onPageChange(index)}
              onMomentumScrollEnd={(e, state, context) => {}}
              pagingEnabled={true}
            >
              <View style={OrderMasterStyles.addressListContainerStyle}>
                <AddressListScreen />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "yellow"
                }}
              >
                <Text> Select Time </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "green"
                }}
              >
                <Text> Payment </Text>
              </View>
            </Swiper>
          </View>

          <View style={OrderMasterStyles.goToNextPageView}>
            {this.state.currentPosition > 0 ? (
              <TouchableOpacity onPress={() => this._onPressBackBtn()}>
                <View style={OrderMasterStyles.nextViewStyle}>
                  <Image
                    style={OrderMasterStyles.nextImgStyle}
                    source={require("../../../Resources/Images/CartScr/BtnLeftAero.png")}
                  />
                  <Text style={{ fontSize: 18, color: "white" }}> Back </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={OrderMasterStyles.nextViewStyle} />
            )}

            {this.state.currentPosition < labels.length - 1 ? (
              <TouchableOpacity onPress={() => this._onPressNextBtn()}>
                <View style={OrderMasterStyles.nextViewStyle}>
                  <Text style={{ fontSize: 18, color: "white" }}> Next </Text>
                  <Image
                    style={OrderMasterStyles.nextImgStyle}
                    source={require("../../../Resources/Images/CartScr/BtnRightAero.png")}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </SafeAreaView>
      </View>
      // </KeyboardAvoidingView>
    );
  }
}

// Store State in store
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
)(OrderMasterScreen);
