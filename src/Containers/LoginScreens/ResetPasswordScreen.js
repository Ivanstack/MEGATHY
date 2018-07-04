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
import { bindActionCreators } from "redux";
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

class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressSave = this.onPressSave.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
        this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onSubmitConfirmPassword = this.onSubmitConfirmPassword.bind(this);

        this.passwordRef = this.updateRef.bind(this, "password");
        this.confirmPasswordRef = this.updateRef.bind(this, "confirmPassword");

        this.state = {
            secureTextEntry: true,
            password: "",
            confirmPassword: "",
        };
    }

    componentWillReceiveProps(newProps) {
        let result = newProps.result === undefined ? null : newProps.result;
        if (newProps.isRPSuccess === true && result != null) {
            if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                CommonUtilities.showAlert(result.data.messageAr, false);
                this.props.navigation.popToTop();
            } else {
                CommonUtilities.showAlert(result.data.message, false);
                this.props.navigation.popToTop();
            }
        }
    }

    onPressSave() {
        if (this.state.password === "") {
            CommonUtilities.showAlert("Password cannot be blank");
            return;
        }

        if (this.state.password != this.state.confirmPassword) {
            CommonUtilities.showAlert("Password and confirm password do not match");
            return;
        }

        let registeredEmail = this.props.navigation.getParam("registeredEmail", "");
        if (registeredEmail === "") {
            constant.debugLog("Something is wrong with response from previous screen");
            return;
        }

        var resetPasswordParameters = {
            email: registeredEmail,
            vendorId: constant.DeviceInfo.getUniqueID(),
            password: this.state.password,
        };

        this.props.onResetPassword(resetPasswordParameters);

        /*
        networkUtility.putRequest(constant.APIUpdatePassword, resetPasswordParameters).then(
            result => {

                if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                    CommonUtilities.showAlert(result.data.messageAr, false);
                    this.props.navigation.popToTop();
                } else {
                    CommonUtilities.showAlert(result.data.message, false);
                    this.props.navigation.popToTop();
                }
            },
            error => {

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        CommonUtilities.showAlert(error.data["message"], false);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
            }
        );
        */
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onFocus() {
        let { errors = {} } = this.state;
        for (let name in errors) {
            let ref = this[name];
            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }
        this.setState({ errors });
    }

    onChangeText(text) {
        var arrTextFieldRef = ["password", "confirmPassword"];
        arrTextFieldRef.map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    }

    onSubmitPassword() {
        this.confirmPassword.focus();
    }

    onSubmitConfirmPassword() {
        this.confirmPassword.blur();
        this.onPressSave();
    }

    onAccessoryPress() {
        this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
    }

    renderPasswordAccessory() {
        let { secureTextEntry } = this.state;
        let name = secureTextEntry ? "visibility" : "visibility-off";
        return (
            <MaterialIcon
                size={24}
                name={name}
                color={TextField.defaultProps.baseColor}
                onPress={this.onAccessoryPress}
                suppressHighlighting
            />
        );
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { errors = {}, secureTextEntry, password, confirmPassword } = this.state;

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
                    <Image
                        style={{ width: 189, height: 59 }}
                        source={require("../../Resources/Images/LogoTitleImage.png")}
                    />

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
                        {baseLocal.t("Change Password")}
                    </Text>

                    <View style={{ width: "80%" }}>
                        // {/* // Password Text Field */}
                        <AppTextField
                            reference={this.passwordRef}
                            label={baseLocal.t("Password")}
                            value={this.state.password}
                            returnKeyType="next"
                            clearTextOnFocus={true}
                            secureTextEntry={secureTextEntry}
                            onSubmitEditing={this.onSubmitPassword}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />
                        // {/* // Confirm Password Text Field */}
                        <AppTextField
                            reference={this.confirmPasswordRef}
                            label={baseLocal.t("Confirm Password")}
                            value={this.state.confirmPassword}
                            returnKeyType="done"
                            clearTextOnFocus={true}
                            secureTextEntry={secureTextEntry}
                            onSubmitEditing={this.onSubmitConfirmPassword}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />
                    </View>

                    {/* // Back and SignU[] Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Back Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressBack}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("Back")}
                            </Text>
                        </TouchableOpacity>

                        {/* // Sign Up Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressSave}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("Save")}
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
        isLoading: state.resetPassword.isLoading,
        isRPSuccess: state.resetPassword.isRPSuccess,
        result: state.resetPassword.result,
        error: state.resetPassword.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onResetPassword: parameters =>
            dispatch({
                type: constant.actions.resetPasswordRequest,
                payload: { endPoint: constant.APIUpdatePassword, parameters: parameters },
            }),
        }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPasswordScreen);

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
