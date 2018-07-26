/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { connect } from "react-redux"; // Redux
import Spinner from "react-native-loading-spinner-overlay"; // Loading View

import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import styles from "./OrderStatusDetailStyle";
import StepIndicator from "react-native-step-indicator";

const arrStepIndicatorlabels = [
    constant.kOrderStatusPlaced,
    constant.kOrderStatusConfirmed,
    constant.kOrderStatusDispatched,
    constant.kOrderStatusDelivered,
];
const activeIndicatorViewHeight = 15;
const indicatorViewHeight = 25;
const customStyles = {
    stepIndicatorSize: 15,
    currentStepIndicatorSize: 15,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: "white", //constant.themeColor,
    stepStrokeWidth: 5,
    stepStrokeFinishedColor: "white",
    stepStrokeUnFinishedColor: "white",
    separatorFinishedColor: constant.themeColor,
    separatorUnFinishedColor: "gray",
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

class OrderStatusDetailScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {};
        this.progressBarHeight = 0;
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Order Details"), true);

    componentDidMount = () => {
        constant.debugLog(
            "order Status :===> " + arrStepIndicatorlabels.indexOf(this.props.navigation.getParam("orderItem").status)
        );
    };

    componentWillReceiveProps = newProps => {};

    _onPressViewOrder = () => {};

    _onPressLiveTracking = () => {
        if (this.props.navigation.getParam("orderItem").status === constant.kOrderStatusDispatched) {
        }
    };

    _renderOrderStatusView = () => {
        let areaItems = arrStepIndicatorlabels.map((item, index) => {
            return (
                // <View key={item} style={[styles.orderStatusContainer]}>
                <View key={item} style={[styles.orderStatusContainer, { top: 2 }]}>
                    <Image
                        style={[styles.imgMsgStyle, { left: 0 }]}
                        resizeMode="cover"
                        source={require("../../../../Resources/Images/Feedback/ChatAngleLeft.png")}
                    />
                    <View
                        style={{
                            width: "96%",
                            backgroundColor: "white",
                            marginLeft: 14,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: constant.themeFont,
                                fontSize: 15,
                                fontWeight: "bold",
                                marginTop: 12,
                                marginLeft: 8,
                            }}
                        >
                            {item}
                        </Text>
                        <Text
                            style={{
                                fontFamily: constant.themeFont,
                                fontSize: 14,
                                marginLeft: 8,
                                color: constant.grayShadeColor55,
                            }}
                        >
                            Your Order Placed Successfully
                        </Text>
                    </View>
                </View>
            );
        });

        return (
            <View
                style={{
                    backgroundColor: "transparent",
                    justifyContent: "space-between",
                    marginTop: 16,
                    // paddingTop: "1.5%",
                    height: Dimensions.get("window").height * 0.65,
                    // marginBottom: "10%",
                }}
            >
                {areaItems}
            </View>
        );
    };

    render = () => {
        let currentStatusIndex = arrStepIndicatorlabels.indexOf(this.props.navigation.getParam("orderItem").status) + 1;
        return (
            // Main View (Container)
            <View style={styles.container}>
                <View
                    style={{
                        height: "85%",
                        flexDirection: "row",
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            marginTop: 8,
                            alignSelf: "flex-start",
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: 20,
                        }}
                    >
                        <View
                            style={{
                                position: "absolute",
                                width: 7,
                                height: "75%",
                                backgroundColor: "white",
                                // marginLeft: 20,
                            }}
                            onLayout={event => {
                                var { x, y, width, height } = event.nativeEvent.layout;
                                this.progressBarHeight = height;
                                // constant.debugLog("Bar Height :===> " + height);
                            }}
                        />
                        <StepIndicator
                            customStyles={customStyles}
                            currentPosition={currentStatusIndex}
                            direction="vertical"
                            stepCount={4}
                            renderStepIndicator={item => {
                                this.progressBarHeight = item.barHeight;
                                let source = "";
                                if (item.stepStatus === "current") {
                                    source = require("../../../../Resources/Images/OrderStatus/PandingState.png");
                                } else if (item.stepStatus === "finished") {
                                    source = require("../../../../Resources/Images/OrderStatus/CompleteState.png");
                                } else if (item.stepStatus === "unfinished") {
                                    source = require("../../../../Resources/Images/OrderStatus/PandingState.png");
                                }
                                return (
                                    <View
                                        style={{
                                            backgroundColor: "white",
                                            width: indicatorViewHeight,
                                            height: indicatorViewHeight,
                                            borderColor: "transparent",
                                            borderWidth: 2,
                                            borderRadius: indicatorViewHeight / 2,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: activeIndicatorViewHeight,
                                                height: activeIndicatorViewHeight,
                                            }}
                                            source={source}
                                        />
                                    </View>
                                );
                            }}
                        />
                    </View>
                    {this._renderOrderStatusView()}
                </View>
                <View style={styles.twoThemeButtonsContainer}>
                    {/* // View Order Button */}
                    <TouchableOpacity style={styles.twoThemeButtons} onPress={this._onPressViewOrder}>
                        <Text style={styles.themeButtonText}>{baseLocal.t("View Order")}</Text>
                    </TouchableOpacity>

                    {/* // Live Tracking Button */}
                    <TouchableOpacity
                        style={[
                            styles.twoThemeButtons,
                            {
                                backgroundColor:
                                    this.props.navigation.getParam("orderItem").status !=
                                    constant.kOrderStatusDispatched
                                        ? constant.buttonDisableColor
                                        : constant.themeColor,
                            },
                        ]}
                        onPress={this._onPressLiveTracking}
                    >
                        <Text style={styles.themeButtonText}>{baseLocal.t("Live Tracking")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
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
)(OrderStatusDetailScreen);
