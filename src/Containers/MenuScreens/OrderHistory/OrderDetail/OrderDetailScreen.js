/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
} from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization

import moment from "moment"; // Date/Time Conversition
import ImageLoad from "react-native-image-placeholder"; //Image Load view
import StepIndicator from "react-native-step-indicator";

// Styles
import OrderDetaileStyles from "./OrderDetaileStyles";

// Class Variable

const arrStepIndicatorlabels = [
    constant.kOrderStatusPlaced,
    constant.kOrderStatusConfirmed,
    constant.kOrderStatusDispatched,
    constant.kOrderStatusDelivered,
];
const customStyles = {
    stepIndicatorSize: 10,
    currentStepIndicatorSize: 10,
    separatorStrokeWidth: StyleSheet.hairlineWidth,
    currentStepStrokeWidth: 0,
    stepStrokeCurrentColor: "transparent", //constant.themeColor,
    stepStrokeWidth: 0,
    stepStrokeFinishedColor: constant.themeGreenColor,
    stepStrokeUnFinishedColor: "white",
    separatorFinishedColor: constant.themeGreenColor,
    separatorUnFinishedColor: "white",
    stepIndicatorFinishedColor: "white", //constant.themeGreenColor,
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelCurrentColor: "black",
    stepIndicatorLabelFinishedColor: "black",
    stepIndicatorLabelUnFinishedColor: "black",
    labelColor: "black",
    labelSize: 15,
    currentStepLabelColor: "black",
};

class OrderDetailScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {};
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Order Details"), true);

    componentDidMount() {}

    componentWillReceiveProps(newProps) {}

    // Render Methods

    _renderCartValueView = (leftTitle, rightTitle, isChangeColor = false) => {
        return (
            <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
                <Text
                    style={[
                        OrderDetaileStyles.boldTitleText,
                        { margin: 6, marginLeft: 16, color: isChangeColor ? constant.themeColor : "black" },
                    ]}
                >
                    {leftTitle}
                </Text>
                <Text
                    style={[
                        OrderDetaileStyles.boldTitleText,
                        { margin: 6, marginRight: 16, color: isChangeColor ? constant.themeColor : "black" },
                    ]}
                >
                    {rightTitle}
                </Text>
            </View>
        );
    };

    _renderExtraChargeView = (leftTitle, rightTitle) => {
        return (
            <View style={{ alignSelf: "flex-end", justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
                <Text style={[OrderDetaileStyles.smallSizeFontTitleText, { marginRight: "10%" }]}> {leftTitle}</Text>
                <View style={{ width: "20%", marginRight: 12 }}>
                    <Text
                        style={{
                            alignSelf: "flex-end",
                            margin: 4,
                            fontSize: 15,
                            fontFamily: constant.themeFont,
                        }}
                    >
                        {rightTitle}
                    </Text>
                </View>
            </View>
        );
    };

    _renderDateAndAddressView = (title, isAddress) => {
        let imgSource = isAddress
            ? require("../../../../Resources/Images/Order/LocationIcon.png")
            : require("../../../../Resources/Images/Order/TimeIcon.png");
        return (
            <View style={{ margin: 4, flexDirection: "row", marginTop: 8 }}>
                <Image style={{ width: 20, height: 20, marginRight: 4 }} source={imgSource} resizeMode="contain" />
                <Text style={[OrderDetaileStyles.normalTitleText, { marginLeft: 8, marginRight: 8 }]}>{title}</Text>
            </View>
        );
    };

    _renderCartDescriptionView = orderItem => {
        return (
            <View>
                {this._renderCartValueView(baseLocal.t("Description"), baseLocal.t("Amount"), true)}
                {this._renderCartValueView(baseLocal.t("Cart Amount"), Number(orderItem.totalAmount).toFixed(2))}
                {this._renderExtraChargeView(baseLocal.t("Delivery Charges"), "+" + orderItem.deliveryCharg)}
                {orderItem.vat != 0 ? this._renderExtraChargeView("VAT", "+" + orderItem.vat) : null}
                {this._renderCartValueView(
                    baseLocal.t("Order Amount"),
                    Number(orderItem.totalAmount + orderItem.deliveryCharg + orderItem.vat).toFixed(2)
                )}

                {orderItem.reward_used != 0
                    ? this._renderExtraChargeView("Redeem Points", "-" + Number(orderItem.reward_used).toFixed(2))
                    : null}

                {orderItem.discount != 0
                    ? this._renderExtraChargeView(baseLocal.t("Coupen Discount"), "-" + orderItem.discount)
                    : null}

                {orderItem.discount != 0 || orderItem.reward_used != 0
                    ? this._renderCartValueView(baseLocal.t("Payable Amount"), Number(orderItem.orderTotal).toFixed(2))
                    : null}
            </View>
        );
    };

    _renderOrderStatusView = orderItem => {
        // let orderItem = this.props.navigation.state.params.orderItem;
        // constant.debugLog("Order Detail :==> " + orderItem);
        let orderStatus =
            orderItem.status === constant.kOrderStatusDelivered
                ? constant.kOrderStatusDeliveredStat
                : constant.kOrderStatusInProcess;
        let orderStatusColor = orderItem.status === constant.kOrderStatusDelivered ? constant.themeGreenColor : "gray";
        return (
            <View style={{ flex: 1, margin: 8, marginRight: 0 }}>
                <Text style={[OrderDetaileStyles.boldTitleText, { marginLeft: 36 }]}>
                    Order Id: {orderItem.displayOrderId}
                </Text>
                {this._renderDateAndAddressView(
                    moment(orderItem.orderDeliveryTime).format("DD-MM-YYYY hh:mm A"),
                    false
                )}
                {this._renderDateAndAddressView(orderItem.address_meta.address, true)}

                <View style={[OrderDetaileStyles.orderStatusViewStyle, { backgroundColor: orderStatusColor }]}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 13,
                            fontWeight: "bold",
                            fontFamily: constant.themeFont,
                        }}
                    >
                        {orderStatus}
                    </Text>
                </View>
            </View>
        );
    };

    _renderOrderItemView = orderItem => {
        return (
            <View style={{ backgroundColor: "white", marginBottom: 10 }}>
                {this._renderOrderStatusView(orderItem)}
                {this._renderCartDescriptionView(orderItem)}
                <View
                    style={{
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: constant.darkGrayBGColor,
                    }}
                />
                <View style={{ margin: 16, marginTop: 16 }}>
                    <Text>
                        <Text style={{ fontFamily: constant.themeFont, fontSize: 15 }}>{baseLocal.t("Payment")} :</Text>
                        <Text
                            style={{
                                fontFamily: constant.themeFont,
                                fontSize: 15,
                                color: constant.themeColor,
                            }}
                        >
                            {" "}
                            {baseLocal.t(orderItem.paymentMode)}
                        </Text>
                    </Text>
                </View>
                <View style={{ margin: 16, marginBottom: 8 }}>
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={arrStepIndicatorlabels.indexOf(orderItem.status)}
                        labels={arrStepIndicatorlabels}
                        stepCount={arrStepIndicatorlabels.length}
                        renderStepIndicator={item => {
                            let source = "";
                            if (item.stepStatus === "current") {
                                source = require("../../../../Resources/Images/Order/orderStepComplete.png");
                            } else if (item.stepStatus === "finished") {
                                source = require("../../../../Resources/Images/Order/orderStepComplete.png");
                            } else if (item.stepStatus === "unfinished") {
                                source = require("../../../../Resources/Images/Order/orderStepUnComplete.png");
                            }
                            return (
                                <View>
                                    <Image
                                        style={{
                                            width: 11,
                                            height: 11,
                                        }}
                                        source={source}
                                    />
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        );
    };

    _renderHeader = () => {
        let orderItem = this.props.navigation.state.params.orderItem;
        return (
            <View style={[OrderDetaileStyles.scrollView, { backgroundColor: "white", marginBottom: 10 }]}>
                {this._renderOrderItemView(orderItem)}
            </View>
        );
    };

    _renderOrderProductView = ({ item }) => {
        let productItem = item.product;
        // constant.debugLog("Product Item :===> " + JSON.stringify(productItem));
        let imgHeight = (Dimensions.get("window").width * 21) / 100;
        if (productItem != (null || undefined)) {
            return (
                <View
                    style={{ margin: 8, marginTop: 1, marginBottom: 0, backgroundColor: "white", flexDirection: "row" }}
                >
                    {/* Product Image View */}
                    <View>
                        <ImageLoad
                            style={{ height: imgHeight, width: imgHeight, margin: 8 }}
                            isShowActivity={false}
                            placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
                            // source={CommonUtilities.safeImageURL("")}
                            source={CommonUtilities.safeImageURL(productItem.productImageUrl)}
                        />
                    </View>

                    {/* Product Detaile View */}
                    <View
                        style={{
                            width: "90%",
                        }}
                    >
                        {/* Product Detail View */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "80%",
                                marginTop: 4,
                                marginLeft: 4,
                            }}
                        >
                            <View style={{ backgroundColor: "transparent", width: "60%" }}>
                                <Text
                                    style={{
                                        fontFamily: constant.themeFont,
                                        fontSize: 16,
                                        color: constant.themeColor,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {global.currentAppLanguage === "en"
                                        ? productItem.productName
                                        : productItem.productNameAr}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: "transparent", marginRight: 8 }}>
                                <Text
                                    style={{
                                        fontFamily: constant.themeFont,
                                        fontSize: 16,
                                        color: constant.grayShadeColor55,
                                    }}
                                >
                                    {baseLocal.t("Qty")}: {item.orderQuentity}
                                </Text>
                            </View>
                        </View>

                        {/* Product Category View */}

                        <View style={{ margin: 4 }}>
                            <Text
                                style={{
                                    fontFamily: constant.themeFont,
                                    fontSize: 15,
                                    color: constant.themeColor,
                                }}
                            >
                                {global.currentAppLanguage === "en"
                                    ? productItem.categoryName
                                    : productItem.categoryNameAr}
                            </Text>
                        </View>

                        {/* Product Amount View */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "80%",
                                marginBottom: 4,
                                marginLeft: 4,
                            }}
                        >
                            <View style={{ backgroundColor: "transparent", width: "30%" }}>
                                <Text
                                    style={{
                                        fontFamily: constant.themeFont,
                                        fontSize: 14,
                                        color: constant.grayShadeColor55,
                                    }}
                                >
                                    {productItem.productQuntity}{" "}
                                    {global.currentAppLanguage === "en"
                                        ? productItem.productUnit
                                        : productItem.productUnitAr}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: "transparent", marginRight: 8 }}>
                                <Text
                                    style={{
                                        fontFamily: constant.themeFont,
                                        fontSize: 15,
                                        color: constant.grayShadeColor55,
                                        fontWeight: "bold",
                                    }}
                                >
                                    SAR {item.totalAmount}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    };

    render() {
        let orderItem = this.props.navigation.state.params.orderItem;
        return (
            // Main View (Container)
            <View>
                <SafeAreaView style={OrderDetaileStyles.mainContainer}>
                    <FlatList
                        style={{
                            width: "100%",
                            height: "100%",
                            // paddingBottom: 10,
                            // backgroundColor: "orange"
                        }}
                        ref={flatList => {
                            this.productList = flatList;
                        }}
                        data={orderItem.order_meta}
                        keyExtractor={(item, index) => item.orderMetaId.toString()}
                        renderItem={this._renderOrderProductView.bind(this)}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        directionalLockEnabled
                        ListHeaderComponent={this._renderHeader.bind(this)}
                        // ListFooterComponent={this._renderFooter.bind(this)}
                    />
                </SafeAreaView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.login.isLoading,
        isSuccess: state.login.isSuccess,
        result: state.login.result,
        error: state.login.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLogin: parameters =>
            dispatch({
                type: constant.actions.loginRequest,
                payload: { endPoint: constant.APILogin, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderDetailScreen);
