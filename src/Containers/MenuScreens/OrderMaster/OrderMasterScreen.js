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
  TouchableWithoutFeedback,
  Alert,
  AppState,
  SafeAreaView,
  FlatList,
  AsyncStorage,
  Dimensions
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../Helper/CommonStyle";
import * as constant from "../../../Helper/Constants";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Swiper from "react-native-swiper";
import StepIndicator from "react-native-step-indicator";
import Moment from "moment";
import { observable } from "mobx";
import { observer } from "mobx-react";

// Network Utility
import * as networkUtility from "../../../Helper/NetworkUtility";

// Components Style
import OrderMasterStyles from "./OrderMasterStyles";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";

// Variable
const activeIndicatorViewHeight = 20;
const inactiveIndicatorViewHeight = 15;
const labels = ["Select Address", "Select Time", "Payment Method"];
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
  // stepIndicatorLabelFontSize: 13,
  // currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: constant.themeColor,
  stepIndicatorLabelFinishedColor: constant.themeColor,
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: constant.themeColor
};

@observer
class OrderMasterScreen extends Component {
  constructor(props) {
    super(props);
    //Class State
    this.state = {
      currentPosition: 0,
      visible: false,
      storeTime: ""
    };
    classContext = this;
  }

  @observable storeCurrentTime = "";

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
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              //   navigation.state.params.prdtScrContex.setState({ isReload: true });
              //   navigation.state.params.onNavigateBack();
              navigation.goBack();
              //   navigation.navigate('CartScreen');
            }}
          >
            <Icon
              name="close-o"
              style={{ marginLeft: 10 }}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text style={OrderMasterStyles.headerText}> Select Address </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              classContext._onPressBackBtn();
            }}
          >
            <Icon
              name="arrow-left"
              // style={{ marginLeft: 10 }}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              classContext._onPressNextBtn();
            }}
          >
            <Icon
              name="arrow-right"
              // style={{ marginLeft: 10 }}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: constant.themeColor
    }
  });

  // App Life Cycle Methods
  async componentDidMount() {
    console.log("App State: ", AppState.currentState);
    this._getStoreTime();

    // this.interval = setInterval(this._getStoreTime, 1000);
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
    // clearInterval(this.interval);
  }

  componentWillUpdate() {
    // console.log('props data :', this.props.firstComp);
    // this.props.navigation.navigate('FirstScrElement');
  }

  // Mics Methods

  _getStoreTime = () => {
    console.log("Call get storeTime .....");

    // Show Loading View
    this.setState({ visible: true });

    let storeTime = networkUtility
      .getRequest(constant.getStoreTimeZone)
      .then(
        result => {
          let responseData = result.data.data;
          console.log("Get storeTime :======> ", responseData);

          let storeCrtTime = responseData.storeTime;
          storeCrtTime = Moment(storeCrtTime).format("hh:mm:ss A");
          console.log("Get storeTime after convert :======> ", storeCrtTime);

          this.storeCurrentTime = storeCrtTime;

          // Hide Loading View
          this.setState({
            visible: false,
            storeTime: responseData.storeTime
          });
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
              setTimeout(() => {
                alert(error.data["messageAr"]);
              }, 200);
            } else {
              setTimeout(() => {
                alert(error.data["message"]);
              }, 200);
            }
          } else {
            constants.debugLog("Internal Server Error: " + error.data);
            setTimeout(() => {
              alert("Something went wrong, plese try again");
            }, 200);
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
    this._swiper.scrollBy(1);
    // if (this.state.currentPosition < labels.length - 1) {
    //   this.setState({ currentPosition: this.state.currentPosition + 1 });
    // }
  };

  _onPressBackBtn = () => {
    this._swiper.scrollBy(-1);
    // if (this.state.currentPosition < labels.length - 1) {
    //   this.setState({ currentPosition: this.state.currentPosition + 1 });
    // }
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
            // backgroundColor: "yellow"
          }}
        >
          <View style={OrderMasterStyles.orderActionView}>
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

            <View style={{flex:1}}> 
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: constant.themeFont,
                  color: constant.themeColor,
                  fontWeight: "bold",
                  alignSelf:"flex-end"
                }}
              >
                {" "}
                Store Current Time : {this.storeCurrentTime}{" "}
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
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "blue"
                }}
              >
                <Text> Select Address </Text>
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
