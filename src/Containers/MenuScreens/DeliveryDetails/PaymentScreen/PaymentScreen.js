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
    Image,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";

import * as constant from "../../../../Helper/Constants";

// Redux
import { connect } from "react-redux";

// Libs
import CollapsibleList from "react-native-collapsible-list";
import SegmentedControlTab from "react-native-segmented-control-tab";

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// Component Style
import PaymentStyle from "./PaymentStyle";

// Common Function
import * as fnCart from "../../../../Helper/Functions/Cart";

// Components
import AppTextField from "../../../../Components/AppTextField";

class PaymentScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            txtCoupenCode: "",
            paymentByCard: true,
        };
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
        // constant.debugLog("Selected Time :===> " + global.selectedTimeSlot);
        // constant.debugLog("Selected Address :===> " + global.selectedAddress);
    }

    componentWillUnmount() {}

    // Mics Methods

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
            this.props.parentContext.setState({ currentPosition: 0 });
        } else if (global.selectedTimeSlot === null) {
            this.props.parentContext.setState({ currentPosition: 1 });
        }
        constant.debugLog("Selected Time :===> " + JSON.stringify(global.selectedTimeSlot));
        constant.debugLog("Selected Address :===> " + JSON.stringify(global.selectedAddress));
    };

    // Render View
    _renderCartValueView = (leftTitle, rightTitle) => {
        return (
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={PaymentStyle.boldTitleText}>{leftTitle}</Text>
                <Text style={PaymentStyle.boldTitleText}>{rightTitle}</Text>
            </View>
        );
    };

    _renderCartDescriptionView = () => {
        return (
            <View>
                <Text style={[PaymentStyle.normalTitleText, { marginLeft: 16 }]}>
                    Delivery Address:{" "}
                    {global.selectedAddress != null && global.selectedAddress.address
                        ? global.selectedAddress.address
                        : ""}
                </Text>
                {this._renderCartValueView("Description", "Amount(SAR)")}
                {this._renderCartValueView("Cart Amount", fnCart.getTotalPriceCartItems())}
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <Text style={[PaymentStyle.smallSizeFontTitleText, { marginLeft: "50%" }]}> Delivery Charges</Text>
                    <Text style={[PaymentStyle.smallSizeFontTitleText, { marginRight: 12 }]}>+{"15.00"}</Text>
                </View>
                {this._renderCartValueView("Order Amount", fnCart.getTotalPriceCartItems() + 15)}
            </View>
        );
    };

    _renderPaymentMethodSelectionView = () => {
        return (
            <View style={{ flexDirection: "row" }}>
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

    render() {
        return (
            // Main View (Container)
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
                    {this._renderCartDescriptionView()}
                    {this._renderCoupenCodeView()}
                    <Text style={[PaymentStyle.normalTitleText, { marginLeft: 15 }]}>Select payment method</Text>
                    {this._renderPaymentMethodSelectionView()}
                    {/* <View style={{alignSelf:"flex-end"}}> */}
                    <TouchableOpacity
                        style={{
                            height: 40,
                            width: "90%",
                            // flex:1,
                            margin: 16,
                            bottom: 0,
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            // alignSelf:"flex-end",
                            backgroundColor: constant.themeColor,
                        }}
                        onPress={this.onPressSend.bind(this)}
                    >
                        <Text style={PaymentStyle.headerText}> SEND </Text>
                    </TouchableOpacity>
                    {/* </View> */}
                </SafeAreaView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
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
)(PaymentScreen);
