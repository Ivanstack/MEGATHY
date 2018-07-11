/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions,
} from "react-native";

import AppTextField from "../../Components/AppTextField";
import * as constant from "../../Helper/Constants";

// Redux
import { connect } from "react-redux";

// Common Utilities
import * as CommonUtilities from "../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Localization
import baseLocal from "../../Resources/Localization/baseLocalization";

class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);
        this.state = {
            email: "",
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isFPSuccess === true && newProps.result != null) {
            this.props.navigation.navigate("VerifyCodeScreen", {
                forgotPasswordResponse: newProps.result.data.data,
                confirmationType: constant.APIConfirmationTypeForgotPassword,
                registeredEmail: this.state.email,
            });
        }
    }

    _onPressReset = () => {
        if (!CommonUtilities.validateEmail(this.state.email)) {
            CommonUtilities.showAlert("Invalid email id");
            return;
        }
        var forgotPasswordParameters = {
            email: this.state.email,
            vendorId: constant.DeviceInfo.getUniqueID(),
        };

        this.props.onForgotPassword(forgotPasswordParameters);
    };

    _onPressBack = () => {
        this.props.navigation.goBack();
    };

    _onFocus = () => {
        let { errors = {} } = this.state;
        for (let name in errors) {
            let ref = this[name];
            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }
        this.setState({ errors });
    };

    _onChangeText = text => {
        ["email"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    };

    _onSubmitEmail = () => {
        this.email.blur();
        this._onPressReset();
    }

    render() {
        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner
                    visible={this.props.isLoading}
                    cancelable={true}
                    // textContent={"Please wait..."}
                    textStyle={{ color: "#FFF" }}
                />
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                    {/* // Top Image */}
                    {constant.logoImage()}

                    {/* // Sign Up Text */}
                    <Text
                        style={{
                            fontFamily: "Ebrima",
                            fontWeight: "bold",
                            fontSize: 17,
                            color: "white",
                            marginTop: 10,
                        }}
                    >
                        {baseLocal.t("Forgot Password")}
                    </Text>

                    <View style={{ width: "80%" }}>
                        {/* // Email Text Field */}
                        <AppTextField
                            reference={"email"}
                            label={baseLocal.t("Email Id")}
                            value={this.state.email}
                            returnKeyType="next"
                            keyboardType="email-address"
                            onSubmitEditing={this._onSubmitEmail}
                            onChangeText={this._onChangeText}
                            onFocus={this._onFocus}
                        />
                    </View>

                    {/* // Back and Reset Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Back Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this._onPressBack}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("Back")}
                            </Text>
                        </TouchableOpacity>

                        {/* // Reset Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this._onPressReset}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("Reset")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.forgotPassword.isLoading,
        isFPSuccess: state.forgotPassword.isFPSuccess,
        result: state.forgotPassword.result,
        error: state.forgotPassword.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onForgotPassword: parameters =>
            dispatch({
                type: constant.actions.forgotPasswordRequest,
                payload: { endPoint: constant.APIForgotPassword, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CF2526",
    },
    signUpButtonStyle: {
        width: "45%",
        marginTop: 20,
        backgroundColor: "#99050D",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
});
