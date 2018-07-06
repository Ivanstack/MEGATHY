/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, Text, View, Image, TouchableOpacity, SafeAreaView, Keyboard } from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import * as constant from "../../../Helper/Constants";
import * as commonUtility from "../../../Helper/CommonUtilities";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import StepIndicator from "react-native-step-indicator";

// Network Utility
import * as networkUtility from "../../../Helper/NetworkUtility";

// Components Style
import styles from "./OrderMasterStyles";

// Screen
import AddressListScreen from "../DeliveryDetails/AddressList/AddressListScreen";
import CalendarScreen from "./Calendar/CalendarScreen";
import SelectTimeScreen from "./SelectTime/SelectTimeScreen";
import OrderSummaryScreen from "../DeliveryDetails/OrderSummaryScreen/OrderSummaryScreen";
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
    currentStepLabelColor: constant.themeColor,
};

var isScheduleOrder = false;
class OrderMasterScreen extends Component {
    constructor(props) {
        super(props);
        //Class State
        this.state = {
            currentPosition: 0,
            visible: false,
            storeTime: new Date().getTime(),
        };
        classContext = this;
    }
    /*
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                    alignItems: "center",
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
                    <Text style={styles.headerText}> Select Address </Text>
                    {/ )} /}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "50%",
                        justifyContent: "flex-end",
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
            backgroundColor: constant.themeColor,
        },
    });
*/
    // App Life Cycle Methods
    componentDidMount() {
        isScheduleOrder = this.props.parentScreen.isScheduleOrder;
        this.props.getStoreTime();
        this.props.getAppSettingAndReward();
    }

    componentWillUnmount() {
        clearInterval(this.storeCrntTimeInterval);
    }

    componentWillUpdate() {}

    componentWillReceiveProps(newProps) {
        if (newProps.isStoreTimeSuccess === true) {
            let storeDate = new Date(newProps.storeDate);
            this.setState(
                {
                    storeTime: storeDate.getTime(),
                },
                () => {
                    this.storeCrntTimeInterval = setInterval(this._timerForStoreCurrentTime, 1000);
                }
            );
        }
    }

    _displayNavigationHeader(){
        if(this.state.currentPosition == 0){
            return baseLocal.t("Select Address")
        }else if(this.state.currentPosition == 1){
            return baseLocal.t("Select Time")
        }else{
            return baseLocal.t("Payment")
        }
    }

    // Mics Methods
    _displayStoreTime() {
        return new Date(this.state.storeTime).toLocaleTimeString("en-us");

        // let storeDateTemp = new Date(this.state.storeTime)
        // let hh = storeDateTemp.getHours()
        // let mm = storeDateTemp.getMinutes()
        // let ss = storeDateTemp.getSeconds()
        // let am_pm = ""
        // hh > 11 ? am_pm = "PM" : am_pm = "AM"
        // hh = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh
        // hh = hh < 10 ? "0" + hh : hh
        // mm = mm < 10 ? "0" + mm : mm
        // ss = ss < 10 ? "0" + ss : ss

        // return hh + ":" + mm + ":" + ss + " " + am_pm
    }

    _timerForStoreCurrentTime = () => {
        this.setState({
            storeTime: this.state.storeTime + 1000,
        });
    };

    _onPageChange(position) {
        // constant.debugLog("Change Index _onPageChange :==> " + position);
        Keyboard.dismiss();
        if (position < 0) {
            position = 0;
        } else if (position >= 3) {
            position = 2;
        }
        this.setState({ currentPosition: position });
    }

    _onPressPageChange = position => {
        // constant.debugLog("Change Index :==> " + position);
        Keyboard.dismiss();
        if (position < 0) {
            position = 0;
        } else if (position >= 3) {
            position = 2;
        }
        let scrollIndex = position - this.state.currentPosition;
        // constant.debugLog("scroll Index :==> " + scrollIndex);
        this._swiper.scrollBy(scrollIndex, true);
    };

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

    _renderCustomNavigationView() {
        return (
            <View style={styles.navigationView}>
                <TouchableOpacity
                    style={styles.navCloseButton}
                    onPress={() => {
                        this.props.parentScreen.setState({
                            isOrderMasterVisible: false,
                        });
                    }}
                >
                    <Icon name="close-o" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.navHeaderText}> {this._displayNavigationHeader()} </Text>
                <View
                    style={styles.navArrowButtons}
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
        );
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: constant.darkGrayBGColor,
                }}
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                    }}
                >
                    {this._renderCustomNavigationView()}
                    <View style={styles.orderActionView}>
                        <View style={{ marginTop: 8 }}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={this.state.currentPosition}
                                labels={labels}
                                onPress={position => this._onPressPageChange(position)}
                                stepCount={labels.length}
                                renderStepIndicator={item => {
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
                                                            : inactiveIndicatorViewHeight,
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
                                    alignSelf: "flex-end",
                                }}
                            >
                                Store Current Time : {this._displayStoreTime()}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            //   backgroundColor: "blue",
                        }}
                    >
                        <Swiper
                            //   style={styles.swipeViewWrapper}
                            ref={swiper => {
                                this._swiper = swiper;
                            }}
                            loop={false}
                            index={this.state.currentPosition}
                            onIndexChanged={index => this._onPageChange(index)}
                            onMomentumScrollEnd={(e, state, context) => {}}
                            pagingEnabled={true}
                        >
                            {/* ----- AddressListScreen ----- */}
                            <View style={styles.addressListContainerStyle}>
                                <AddressListScreen parentScreen={this} />
                            </View>

                            {this.props.parentScreen.isScheduleOrder != undefined &&
                            this.props.parentScreen.isScheduleOrder === true ? (
                                // {/* ----- SelectTimeScreen ----- */}
                                <View style={styles.orderTimeSlotContainerStyle}>
                                    <CalendarScreen parentScreen={this} />
                                </View>
                            ) : (
                                // {/* ----- SelectTimeScreen ----- */}
                                <View style={styles.orderTimeSlotContainerStyle}>
                                    <SelectTimeScreen parentScreen={this} />
                                </View>
                            )}

                            {/* ----- OrderSummaryScreen ----- */}
                            <View style={styles.paymentContainerStyle}>
                                <OrderSummaryScreen parentScreen={this} />
                            </View>
                        </Swiper>
                    </View>

                    <View style={styles.goToNextPageView}>
                        {this.state.currentPosition > 0 ? (
                            <TouchableOpacity onPress={() => this._onPressBackBtn()}>
                                <View style={styles.nextViewStyle}>
                                    <Image
                                        style={styles.nextImgStyle}
                                        source={require("../../../Resources/Images/CartScr/BtnLeftAero.png")}
                                    />
                                    <Text style={{ fontSize: 18, color: "white" }}> Back </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.nextViewStyle} />
                        )}

                        {this.state.currentPosition < labels.length - 1 ? (
                            <TouchableOpacity onPress={() => this._onPressNextBtn()}>
                                <View style={styles.nextViewStyle}>
                                    <Text style={{ fontSize: 18, color: "white" }}> Next </Text>
                                    <Image
                                        style={styles.nextImgStyle}
                                        source={require("../../../Resources/Images/CartScr/BtnRightAero.png")}
                                    />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.nextViewStyle} />
                        )}
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
        isLoading: state.general.isLoading,
        isSettingsSuccess: state.general.isSettingsSuccess,
        isStoreTimeSuccess: state.general.isStoreTimeSuccess,
        storeDate: state.general.storeDate,
        error: state.general.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAppSettingAndReward: () =>
            dispatch({
                type: constant.actions.getAppSettingAndRewardPointRequest,
                payload: {
                    endPoint: constant.APIGetAppSettingsAndRewards,
                    parameters: "",
                },
            }),
        getStoreTime: () =>
            dispatch({
                type: constant.actions.getStoreTimezoneRequest,
                payload: {
                    endPoint: constant.APIGetStoreTimeZone,
                    parameters: "",
                },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderMasterScreen);
