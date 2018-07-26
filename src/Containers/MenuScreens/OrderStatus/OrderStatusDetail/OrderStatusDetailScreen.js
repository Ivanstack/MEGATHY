/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
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

class OrderStatusDetailScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {};
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Order Details"), true);

    componentDidMount = () => {};

    componentWillReceiveProps = newProps => {};

    _onPressViewOrder = () => {};

    _onPressLiveTracking = () => {
        if (this.props.navigation.getParam("orderItem").status === constant.kOrderStatusDispatched) {

        }
    };

    render = () => {
        return (
            // Main View (Container)
            <View style={styles.container}>
                <View style={{ height: "85%" }}>

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
