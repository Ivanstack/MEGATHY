/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Text,
    View,
    Image,
    Animated,
    TextInput,
    ScrollView,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

import * as constant from "../../../../Helper/Constants";

// Redux
import { connect } from "react-redux";

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Loading View
// import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// Component Style
import PaymentStyle from "./OrderSummaryStyle";

// Common Function
import * as fnCart from "../../../../Helper/Functions/Cart";

// Components
import AppTextField from "../../../../Components/AppTextField";

// Variable
const redeemPointViewViewHeight = (6 * Dimensions.get("window").height) / 100;

class OrderSummaryScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.redeemView_Y_Translate = new Animated.Value(0);
        this.state = {
            txtCoupenCode: "",
            txtRedeemPoint: "",
            paymentByCard: true,
            isOpenRedeemPointView: false,
        };
        this.orderAmount =
            fnCart.getTotalPriceCartItems() +
            parseFloat(this._getDeliveryChargesFromOrderAmount(fnCart.getTotalPriceCartItems()));
        this.isAvailableVAT = false;
        this.objCartDescription = {};
        this.objCartDescription["basicOrderAmount"] =
            fnCart.getTotalPriceCartItems() +
            parseFloat(this._getDeliveryChargesFromOrderAmount(fnCart.getTotalPriceCartItems()));
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            if (navigation.state.params != undefined && navigation.state.params.category != undefined) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("DrawerToggle");
                            }
                        }}
                    >
                        <Icon
                            name={
                                navigation.state.params != undefined && navigation.state.params.category != undefined
                                    ? "arrow-left"
                                    : "navicon"
                            }
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={PaymentStyle.headerText}> Meghathy </Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    componentDidMount() {
        Animated.timing(this.redeemView_Y_Translate, {
            toValue: redeemPointViewViewHeight,
            duration: 1.5,
        }).start();

        this._prepareCartDescription();
    }

    componentWillUnmount() {}

    // Mics Methods

    _isValidRedeemPoint = strRedeemPoint => {
        if (!isNaN(strRedeemPoint) && Number(strRedeemPoint) < Number(this.props.totalRewardPoint)) {
            return true;
        }
        return false;
    };

    // Create Cart Description Object
    _prepareCartDescription = () => {
        this.objCartDescription["deliveryCharges"] = this._getDeliveryChargesFromOrderAmount(
            this.objCartDescription.basicOrderAmount
        );
        if (global.currentSettings["vat-percentage"] > 0) {
            this.isAvailableVAT = true;
            this.objCartDescription["vatAmount"] = (
                ((this.objCartDescription.basicOrderAmount + this.objCartDescription.deliveryCharges) *
                    global.currentSettings["vat-percentage"]) /
                100
            ).toFixed(2);
            this.objCartDescription["finalOrderAmount"] = this._getOrderAmountIncludingVAT();
        } else {
            this.objCartDescription["finalOrderAmount"] = this.objCartDescription.basicOrderAmount;
        }

        this.setState({ txtRedeemPoint: this.props.totalRewardPoint });
        // constant.debugLog("cart description :===> " + JSON.stringify(this.objCartDescription));
    };

    // Get Remaining Reward Point From Total Reward Point
    _remainingRedeemPoint = strRedeemPoint => {
        if (this._isValidRedeemPoint(strRedeemPoint)) {
            this.setState({ txtRedeemPoint: strRedeemPoint });
        } else {
            this.setState({ txtRedeemPoint: this.props.totalRewardPoint });
            // CommonUtilities.showAlert("total points is smaller then used point", false);
        }
    };

    // Get Order Amount After VAT
    _getOrderAmountIncludingVAT = () => {
        let orderAmount = this.objCartDescription.basicOrderAmount;
        let grossAmount = orderAmount;
        if (global.currentSettings["vat-percentage"] > 0) {
            grossAmount = grossAmount + (orderAmount * global.currentSettings["vat-percentage"]) / 100;
        }
        // let pointAmount = (this.state.txtRedeemPoint * global.currentSettings["reward-sr"]) / 100;
        // if (pointAmount > grossAmount) {
        //     pointAmount = (grossAmount * this.state.txtRedeemPoint) / pointAmount;
        // }
        return grossAmount;
    };

    // Get Final Order After Applied Reward Point
    _getSARValueFromRewardPoint = () => {
        let grossAmount = this.objCartDescription.finalOrderAmount;
        let pointAmount = (this.state.txtRedeemPoint * global.currentSettings["reward-sr"]) / 100;
        if (pointAmount > grossAmount) {
            pointAmount = (grossAmount * this.state.txtRedeemPoint) / pointAmount;
            this.setState({ txtRedeemPoint: pointAmount.toFixed(0) });
        }
        pointAmount = pointAmount.toFixed(2);

        // this.objCartDescription["finalOrderAmount"] = this.objCartDescription.finalOrderAmount - pointAmount;
        return pointAmount;
    };

    // Get Delivery Charges According To Order Amount
    _getDeliveryChargesFromOrderAmount = orderAmount => {
        let arrDeliveryCharges = [];
        if (global.currentSettings) {
            arrDeliveryCharges = global.currentSettings["delivery-charges"];
        }
        let deliveryCharges = 0;
        arrDeliveryCharges.map(charges => {
            if (orderAmount <= charges.maxValue && orderAmount > charges.minValue && orderAmount != 0) {
                deliveryCharges = charges.price;
            }
        });
        return deliveryCharges;
    };

    // Apply Coupne Code
    _applyCoupneCode = () => {
        
    };

    // onPress Methods
    onPressPaymentMethodChange = () => {
        this.setState({
            paymentByCard: !this.state.paymentByCard,
        });
    };

    onPressSend = () => {
        // this.setState({
        //     paymentByCard: !this.state.paymentByCard,
        // });
        if (global.selectedAddress === null) {
            this.props.parentScreen._swiper.scrollBy(-2, true);
            // this.props.parentScreen.setState({ currentPosition: 0 });
        } else if (global.selectedTimeSlot === null) {
            this.props.parentScreen._swiper.scrollBy(-1, true);
            // this.props.parentScreen.setState({ currentPosition: 1 });
        }
        // constant.debugLog("Selected Time :===> " + JSON.stringify(global.selectedTimeSlot));
        // constant.debugLog("Selected Address :===> " + JSON.stringify(global.selectedAddress));
        // constant.debugLog("totalRewardPoint :===> " + this.props.totalRewardPoint);
        // constant.debugLog("totalRewardPoint_SR :===> " + this.props.totalRewardPoint_SR);
    };

    _onPressShowHideRedeemView = () => {
        // constant.debugLog("orderNow Called ...");

        if (!this.state.isOpenRedeemPointView) {
            this.setState(
                {
                    isOpenRedeemPointView: true,
                    txtRedeemPoint:
                        this.state.txtRedeemPoint == 0 ? this.props.totalRewardPoint : this.state.txtRedeemPoint,
                },
                () => {
                    this.redeemView_Y_Translate.setValue(0.75 * redeemPointViewViewHeight);
                    Animated.timing(this.redeemView_Y_Translate, {
                        toValue: -0.75 * redeemPointViewViewHeight,
                        duration: 250,
                        // friction: 3
                    }).start();
                }
            );
        } else {
            this.setState(
                {
                    isOpenRedeemPointView: false,
                },
                () => {
                    this.redeemView_Y_Translate.setValue(-0.75 * redeemPointViewViewHeight);
                    Animated.timing(this.redeemView_Y_Translate, {
                        toValue: redeemPointViewViewHeight,
                        duration: 250,
                        // friction: 5,
                    }).start();
                }
            );
        }
    };

    // Render View
    _renderCartValueView = (leftTitle, rightTitle) => {
        return (
            <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
                <Text style={PaymentStyle.boldTitleText}>{leftTitle}</Text>
                <Text style={PaymentStyle.boldTitleText}>{rightTitle}</Text>
            </View>
        );
    };

    _renderExtraChargeView = (leftTitle, rightTitle) => {
        return (
            <View style={{ alignSelf: "flex-end", justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
                <Text style={[PaymentStyle.smallSizeFontTitleText, { marginRight: "10%" }]}> {leftTitle}</Text>
                <Text style={[PaymentStyle.smallSizeFontTitleText, { right: 8 }]}>{rightTitle}</Text>
            </View>
        );
    };

    _renderCartDescriptionView = () => {
        return (
            <View style={{ flex: 1 }}>
                <Text style={[PaymentStyle.normalTitleText, { marginLeft: 16 }]}>
                    Delivery Address:{" "}
                    {global.selectedAddress != null && global.selectedAddress.address
                        ? global.selectedAddress.address
                        : ""}
                </Text>
                {this._renderCartValueView(baseLocal.t("Description"), "Amount(SAR)")}
                {this._renderCartValueView(baseLocal.t("Cart Amount"), fnCart.getTotalPriceCartItems())}
                {this._renderExtraChargeView(
                    baseLocal.t("Delivery Charges"),
                    "+" + parseFloat(this._getDeliveryChargesFromOrderAmount(fnCart.getTotalPriceCartItems()))
                )}
                {this._renderCartValueView("Order Amount", this.objCartDescription.basicOrderAmount)}
                {this.isAvailableVAT
                    ? this._renderExtraChargeView(
                          global.currentSettings["vat-percentage"] + "% VAT",
                          "+" + this.objCartDescription.vatAmount
                      )
                    : null}
                {this.state.isOpenRedeemPointView
                    ? this._renderExtraChargeView(
                          "Redeem Points(" + this.state.txtRedeemPoint + ")",
                          "-" + this._getSARValueFromRewardPoint()
                      )
                    : null}
                {this.state.isOpenRedeemPointView || this.isAvailableVAT
                    ? this._renderCartValueView(
                          "Payable Amount",
                          this.objCartDescription.finalOrderAmount.toFixed(2) - this._getSARValueFromRewardPoint()
                      )
                    : null}
            </View>
        );
    };

    _renderPaymentMethodSelectionView = () => {
        return (
            <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                    disabled={this.state.paymentByCard}
                    onPress={this.onPressPaymentMethodChange.bind(this)}
                >
                    <Image
                        style={[
                            PaymentStyle.paymentMethodBtn,
                            { borderWidth: this.state.paymentByCard ? StyleSheet.hairlineWidth : 0 },
                        ]}
                        source={require("../../../../Resources/Images/OrderSummary/PaymentCash.png")}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!this.state.paymentByCard}
                    onPress={this.onPressPaymentMethodChange.bind(this)}
                >
                    <Image
                        style={[
                            PaymentStyle.paymentMethodBtn,
                            { borderWidth: !this.state.paymentByCard ? StyleSheet.hairlineWidth : 0 },
                        ]}
                        source={require("../../../../Resources/Images/OrderSummary/PaymentCard.png")}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    _renderCoupenCodeView = () => {
        return (
            <View style={PaymentStyle.mainContainer}>
                <View style={PaymentStyle.coupenCodeTxtField}>
                    {/* // Coupen Code Text Field */}
                    <AppTextField
                        reference={this.coupenCodeRef}
                        clearButtonMode="while-editing"
                        label={baseLocal.t("Coupon code")}
                        value={this.state.txtCoupenCode}
                        returnKeyType="done"
                        keyboardType="default"
                        textColor={constant.themeColor}
                        tintColor={constant.darkGrayBGColor}
                        baseColor={constant.darkGrayBGColor}
                        onChangeText={text => this.setState({ txtCoupenCode: text })}
                    />
                </View>

                <TouchableOpacity style={PaymentStyle.applyBtn}>
                    <View>
                        <Text style={[PaymentStyle.headerText, { fontSize: 13, fontWeight: "bold", marginBottom: 2 }]}>
                            Apply
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _renderRedeemPointView = () => {
        let imgRedeemPointView = this.state.isOpenRedeemPointView
            ? require("../../../../Resources/Images/OrderSummary/selectUserWallet.png")
            : require("../../../../Resources/Images/OrderSummary/CircleWithShadow.png");
        return (
            <Animated.View
                style={[PaymentStyle.redeemPointView, { transform: [{ translateY: this.redeemView_Y_Translate }] }]}
            >
                <TouchableWithoutFeedback onPress={this._onPressShowHideRedeemView.bind(this)}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                        <Image style={{ height: 20, width: 20 }} resizeMode="contain" source={imgRedeemPointView} />
                        <Text style={[PaymentStyle.boldTitleText, { color: constant.themeColor }]}>Redeem Points</Text>
                    </View>
                </TouchableWithoutFeedback>

                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, marginLeft: "10%" }}>
                        <TextInput
                            style={PaymentStyle.txtInputRedeemPoint}
                            keyboardType="decimal-pad"
                            value={this.state.txtRedeemPoint.toString()}
                            onChangeText={text => {
                                this._remainingRedeemPoint(text);
                            }}
                            maxLength={this.props.totalRewardPoint.length}
                        />
                        <Text style={PaymentStyle.smallSizeFontTitleText}>
                            {this.props.totalRewardPoint - this.state.txtRedeemPoint}{" "}
                            {baseLocal.t("Points will remaining in wallet")}
                        </Text>
                    </View>
                    {this.state.isOpenRedeemPointView ? (
                        // <View style={{ backgroundColor: "red" }}>
                        <ImageBackground
                            style={PaymentStyle.imgRedeemPointShow}
                            resizeMode="contain"
                            source={require("../../../../Resources/Images/OrderSummary/CircleWithShadow.png")}
                        >
                            <Text
                                style={{
                                    fontSize: 17,
                                    color: "gray",
                                    fontWeight: "bold",
                                    fontFamily: constant.themeFont,
                                }}
                            >
                                {this.props.totalRewardPoint}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginBottom: 2,
                                    color: "gray",
                                    fontFamily: constant.themeFont,
                                }}
                            >
                                POINTS
                            </Text>
                        </ImageBackground>
                    ) : // </View>
                    null}
                </View>
            </Animated.View>
        );
    };

    render() {
        return (
            // Main View (Container)
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        // style={{ flex: 1}}
                    >
                        <View style={{ marginBottom: 50 }}>
                            {this._renderCartDescriptionView()}
                            {this._renderCoupenCodeView()}
                            <Text style={[PaymentStyle.normalTitleText, { marginLeft: 15 }]}>
                                Select payment method
                            </Text>
                            {this._renderPaymentMethodSelectionView()}
                            {this.state.isOpenRedeemPointView ? <View style={{ height: 200 }} /> : null}
                        </View>
                    </ScrollView>
                    {this._renderRedeemPointView()}

                    <View
                        style={{
                            backgroundColor: "white",
                            bottom: 0,
                            position: "absolute",
                            width: "100%",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                height: 40,
                                width: "90%",
                                margin: 16,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: constant.themeColor,
                            }}
                            onPress={this.onPressSend.bind(this)}
                        >
                            <Text style={PaymentStyle.headerText}> SEND </Text>
                        </TouchableOpacity>
                    </View>

                    {/* </View> */}
                </SafeAreaView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        totalRewardPoint: state.general.totalRewardPoint,
        totalRewardPoint_SR: state.general.totalRewardPoint_SR,
        // isLoading: state.selectTime.isLoading,
        // isSuccess: state.selectTime.isSuccess,
        // objOrderBookedTimeSlote: state.selectTime.objOrderBookedTimeSlote,
        // error: state.selectTime.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // getOrderTimeSession: parameters =>
        //     dispatch({
        //         type: constant.actions.getOrderTimeSessionRequest,
        //         payload: {
        //             endPoint: constant.APIGetOrderTimeSession,
        //             parameters: parameters,
        //         },
        //     }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderSummaryScreen);
