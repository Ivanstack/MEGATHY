/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, Text, View, Image, TouchableOpacity, SafeAreaView, Keyboard, Modal, Alert } from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import * as constant from "../../../Helper/Constants";
import * as commonUtility from "../../../Helper/CommonUtilities";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import StepIndicator from "react-native-step-indicator";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";

// Network Utility
import * as networkUtility from "../../../Helper/NetworkUtility";

// Components Style
import styles from "./OrderMasterStyles";

// Screen
import AddressListScreen from "../DeliveryDetails/AddressList/AddressListScreen";
import CalendarScreen from "./Calendar/CalendarScreen";
import SelectTimeScreen from "./SelectTime/SelectTimeScreen";
import OrderSummaryScreen from "../OrderMaster/OrderSummaryScreen/OrderSummaryScreen";
// import AddressListScreen from "../Category/CartScreen/CartScreen";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";
import OrderMasterStyles from "./OrderMasterStyles";

// Variable
const activeIndicatorViewHeight = 20;
const inactiveIndicatorViewHeight = 15;
const labels = ["Select Address", "Select Time", "Payment"];
const classContext = null;
let arrAction = ["Call you", "Replace it with similar", "Delete it"];
// let arrAction = [
//     { title: "Call you", isSelected: true },
//     { title: "Replace it with similar", isSelected: false },
//     { title: "Delete it", isSelected: false },
// ];
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
var selectedAddress = null;
var selectedTimeSlot = null;
var selectedDates = [];
var selectedAction = arrAction[0];

var objCartDetail = null;
var usedRedeemPoints = 0;

class OrderMasterScreen extends Component {
    constructor(props) {
        super(props);
        //Class State
        this.state = {
            currentPosition: 0,
            visible: false,
            storeTime: new Date().getTime(),
            isReload: false,
            isItemAvailableModalVisible: false,
        };
        classContext = this;
        this.isScheduleOrder = this.props.parentScreen.isScheduleOrder;
    }

    // App Life Cycle Methods
    componentDidMount() {
        isScheduleOrder = this.props.parentScreen.isScheduleOrder;
        this.props.getStoreTime();
        this.props.getAppSettingAndReward();
    }

    componentWillUnmount() {
        clearInterval(this.storeCrntTimeInterval);
    }

    componentWillReceiveProps(newProps) {
        if (
            newProps.objSetOrder != this.props.objSetOrder ||
            newProps.objSetScheduleOrder != this.props.objSetScheduleOrder
        ) {
            let strMsg = this.state.paymentByCard
                ? "Thank you for your order, our employee will deliver your grocery and charge your credit card upon arrival"
                : "Thank you for your order, our employee will deliver your grocery on time.";
            setTimeout(() => {
                Alert.alert(baseLocal.t("Megathy"), baseLocal.t(strMsg), [
                    { text: baseLocal.t("OK"), onPress: this._onPressAlertOkBtn.bind(this), style: "cancel" },
                ]);
            }, 500);
        }

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

    _displayNavigationHeader() {
        if (this.state.currentPosition == 0) {
            return baseLocal.t("Select Address");
        } else if (this.state.currentPosition == 1) {
            return baseLocal.t("Select Time");
        } else {
            return baseLocal.t("Payment");
        }
    }

    // Mics Methods
    _displayStoreTime() {
        return moment(this.state.storeTime).format("hh:mm:ss A");
        // return new Date(this.state.storeTime).toLocaleTimeString("en-us");

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

    // Set Order
    _setOrderForDelivery = () => {
        // constant.debugLog(
        //     "Set Order selectedTimeSlot :===> " +
        //         JSON.stringify(this.selectedTimeSlot) +
        //         "\n\nAddress:==> " +
        //         JSON.stringify(this.selectedAddress) +
        //         "\n\nAction:==> " +
        //         selectedAction
        // );

        var setOrderParameters = {
            city_id: this.selectedAddress.cityId,
            addressId: this.selectedAddress.id, //
            customerNote: selectedAction,
            deliveryCharg: this.objCartDetail.deliveryCharges,
            // deliveryTime: deliveryTime,
            paymentMode: this.state.paymentByCard ? constant.kPaymentModeCard : constant.kPaymentModeCash,
            // userId: global.currentUser.id,
            vendorId: constant.DeviceInfo.getUniqueID(),
        };

        // Set Cart Item
        let arrItem = [];
        for (let index = 0; index < global.arrCartItems.length; index++) {
            const cartItem = global.arrCartItems[index];
            let objItem = {};
            objItem["itemId"] = cartItem.PkId;
            objItem["quentity"] = cartItem.totalAddedProduct;
            arrItem.push(objItem);
        }
        setOrderParameters["item"] = arrItem;

        // Coupen Code Detail
        if (this.props.objCoupenCode != (null || undefined)) {
            setOrderParameters["couponCode"] = this.props.objCoupenCode.code;
            setOrderParameters["discount"] = this.props.objCoupenCode.discount;
        }

        //Redeem Point
        if (this.usedRedeemPoints != 0) {
            setOrderParameters["redeem_reward_points"] = this.usedRedeemPoints;
        }

        // constant.debugLog("Set Order Parameters :===> " + JSON.stringify(setOrderParameters));

        //Simple Order
        if (!this.isScheduleOrder) {
            let deliveryTime =
                this.selectedTimeSlot.tempBookedDate + " " + this.selectedTimeSlot.title.split(" - ")[0] + ":00";
            setOrderParameters["deliveryTime"] = deliveryTime;
            this.props.setOrder(setOrderParameters);
        }

        //Order is schedule
        if (this.isScheduleOrder) {
            setOrderParameters["title"] = "Default Title";
            setOrderParameters["email"] = global.currentUser.email;
            this.props.setScheduleOrder(setOrderParameters);
        }

        constant.debugLog("set order Obj :===> ", this.props.objSetOrder);

        // if (this.props.objSetOrder || this.props.objSetScheduleOrder) {
        //     let strMsg = this.state.paymentByCard
        //         ? "Thank you for your order, our employee will deliver your grocery and charge your credit card upon arrival"
        //         : "Thank you for your order, our employee will deliver your grocery on time.";
        //     setTimeout(() => {
        //         Alert.alert(baseLocal.t("Megathy"), baseLocal.t(strMsg), [
        //             { text: baseLocal.t("OK"), onPress: this._onPressAlertOkBtn.bind(this), style: "cancel" },
        //         ]);
        //     }, 500);
        // }

        // setTimeout(() => {
        //     let strMsg = this.state.paymentByCard
        //         ? "Thank you for your order, our employee will deliver your grocery and charge your credit card upon arrival"
        //         : "Thank you for your order, our employee will deliver your grocery on time.";
        //     Alert.alert(baseLocal.t("Megathy"), baseLocal.t(strMsg), [
        //         { text: baseLocal.t("OK"), onPress: this._onPressAlertOkBtn.bind(this), style: "cancel" },
        //         // { text: buttonTitleNo, onPress: () => reject(""), style: "cancel" },
        //     ]);
        // }, 500);
    };

    // _updateRedeemPoint = (points) => {
    //     constant.debugLog("Update redeem points :===> " + points);
    //     this.updateRedeemPoint = points
    // };

    _onPressAlertOkBtn = () => {
        this.props.parentScreen.props.navigation.navigate(constant.kCategoryScreen);
        this.props.parentScreen.setState({
            isOrderMasterVisible: false,
        });
        // this.props.navigation.resetTo(constant.kCategoryScreen);
    };

    _onPressSelectActionForInAvailableItem = item => {
        // constant.debugLog("modal item :==> " + item);
        // arrAction.map(action => {
        //     if (!action.isSelected && action.title === item.title) {
        //         action.isSelected = true;
        //     } else {
        //         action.isSelected = false;
        //     }
        // });

        selectedAction = item;
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

    _onPressOkForAction = () => {
        this._setOrderForDelivery();
        this.setState({ isItemAvailableModalVisible: false });
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
                <View style={styles.navArrowButtons}>
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

    _renderModalForNotAvailableItem = () => {
        const actionView = arrAction.map(item => {
            return (
                <TouchableOpacity key={item} onPress={this._onPressSelectActionForInAvailableItem.bind(this, item)}>
                    <View style={{ flexDirection: "row", alignItems: "center", margin: 16 }}>
                        {constant.radioImage(item === selectedAction)}
                        <Text style={{ fontFamily: constant.themeFont, fontSize: 12, marginLeft: 16 }}>
                            {/* {item.title} */} {item}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });
        return (
            <Modal
                visible={this.state.isItemAvailableModalVisible}
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => this.setState({ isItemAvailableModalVisible: false })}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={OrderMasterStyles.overlayViewStyle} />

                    <View style={OrderMasterStyles.modalViewStyle}>
                        <TouchableOpacity onPress={() => this.setState({ isItemAvailableModalVisible: false })}>
                            <Image
                                style={{ height: 25, width: 25, right: 8, top: 8, alignSelf: "flex-end" }}
                                source={require("../../../Resources/Images/CartScr/CloseIcon.png")}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: constant.themeFont, fontSize: 13, margin: 16, marginTop: 32 }}>
                            If we don't find items, shall we:
                        </Text>

                        {actionView}
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                // alignItems: "center",
                            }}
                        >
                            <TouchableOpacity onPress={this._onPressOkForAction.bind(this)}>
                                <View style={OrderMasterStyles.okBtnViewStyle}>
                                    <Text
                                        style={{
                                            fontFamily: constant.themeFont,
                                            fontSize: 17,
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        OK
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            // </View>
        );
    };

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
                    {/* <Spinner
                    visible={this.props.isLoading}
                    // cancelable={true}
                    // textContent={"Please wait..."}
                    // textStyle={{ color: "#FFF" }}
                /> */}

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
                        <View style={{ flex: 1, marginRight: 3, marginHorizontal: 7 }}>
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
                                <OrderSummaryScreen
                                    parentScreen={this}
                                    // updateRedeemPoint={points => this._updateRedeemPoint(points)}
                                />
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
                    {this._renderModalForNotAvailableItem()}
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
        objSetOrder: state.orderSummary.objSetOrder,
        objSetScheduleOrder: state.orderSummary.objSetScheduleOrder,
        objCoupenCode: state.orderSummary.objCoupenCode,
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
        setOrder: parameters =>
            dispatch({
                type: constant.actions.setOrderRequest,
                payload: {
                    endPoint: constant.APISetOrder,
                    parameters: parameters,
                },
            }),
        setScheduleOrder: parameters =>
            dispatch({
                type: constant.actions.setScheduleOrderRequest,
                payload: {
                    endPoint: constant.APISetScheduleOrder,
                    parameters: parameters,
                },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderMasterScreen);
