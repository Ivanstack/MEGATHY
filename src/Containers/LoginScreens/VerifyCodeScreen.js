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
import constant from "../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../AppRedux/Actions/actions";

// Device Info
var DeviceInfo = require("react-native-device-info");

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Localization
import baseLocal from "../../Resources/Localization/baseLocalization";

// Common Utilities
import * as CommonUtilities from "../../Helper/CommonUtilities";

class VerifyCodeScreen extends Component {
    constructor(props) {
        super(props);

        const initialCounterValue = 10;
        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressNext = this.onPressNext.bind(this);
        this.onPressCallMe = this.onPressCallMe.bind(this);
        this.onPressResend = this.onPressResend.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.changeTimeInterval = this.changeTimeInterval.bind(this);
        this.codeRef = this.updateRef.bind(this, "code");

        this.state = {
            code: "",
            visible: false,
            timer: null,
            counter: initialCounterValue,
        };
    }

    componentDidMount() {
        let timer = setInterval(this.changeTimeInterval, 1000);
        this.setState({ timer });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    changeTimeInterval() {
        if (this.state.counter == 0) {
            clearInterval(this.state.timer);
            return;
        }
        this.setState({
            counter: this.state.counter - 1,
        });
    }

    onPressNext() {
        if (this.state.code.trim() === "") {
            CommonUtilities.showAlert("Please enter confirmation code");
            return;
        }

        let forgotPasswordResponse = this.props.navigation.getParam("forgotPasswordResponse", "");
        let APIConfirmationType = this.props.navigation.getParam("confirmationType", "");
        let registeredEmail = this.props.navigation.getParam("registeredEmail", "");

        if (forgotPasswordResponse === "" || APIConfirmationType === "" || registeredEmail === "") {
            constant.debugLog("Something is wrong with response from previous screen");
            return;
        }

        var verifyCodeParameters = {
            phone: forgotPasswordResponse.phone,
            vendorId: DeviceInfo.getUniqueID(),
            type: APIConfirmationType,
            code: this.state.code,
        };

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.verifyPhoneCode, verifyCodeParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });

                if (result.status === 200) {
                    this.props.navigation.navigate("ResetPasswordScreen", {
                        registeredEmail: registeredEmail,
                    });
                } else {
                    if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                        setTimeout(() => {
                            CommonUtilities.showAlert(result.data.messageAr, false);
                        }, 200);
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(result.data.message, false);
                        }, 200);
                    }
                }
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(error.data["message"], false);
                        }, 200);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Something went wrong, plese try again");
                }
            }
        );
    }

    onPressCallMe() {
        let forgotPasswordResponse = this.props.navigation.getParam("forgotPasswordResponse", "");
        let APIConfirmationType = this.props.navigation.getParam("confirmationType", "");
        if (forgotPasswordResponse === "" || APIConfirmationType === "") {
            CommonUtilities.showAlert("Something is wrong with response from previous screen", false);
        }

        if (this.state.counter > 0) {
            return;
        }

        var resendCodeParameters = {
            phone: forgotPasswordResponse.phone,
            vendorId: DeviceInfo.getUniqueID(),
            type: APIConfirmationType,
            requestBy: "call",
        };

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.requestVerifyPhones, resendCodeParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });

                if (result.status === 206) {
                    setTimeout(() => {
                        CommonUtilities.showAlert("This number is already verified");
                        // setTimeout(() => {
                        this.props.navigation.goBack();
                        // }, 200);
                    }, 200);
                } else {
                    if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                        setTimeout(() => {
                            CommonUtilities.showAlert(result.data.messageAr, false);
                        }, 200);
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(result.data.message, false);
                        }, 200);
                    }
                }
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(error.data["message"], false);
                        }, 200);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Something went wrong, plese try again");
                }
            }
        );
    }

    onPressResend() {
        let forgotPasswordResponse = this.props.navigation.getParam("forgotPasswordResponse", "");
        let APIConfirmationType = this.props.navigation.getParam("confirmationType", "");
        if (forgotPasswordResponse === "" || APIConfirmationType === "") {
            CommonUtilities.showAlert("Something is wrong with response from previous screen", false);
        }

        if (this.state.counter > 0) {
            return;
        }

        var resendCodeParameters = {
            phone: forgotPasswordResponse.phone,
            vendorId: DeviceInfo.getUniqueID(),
            type: APIConfirmationType,
        };

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.requestVerifyPhones, resendCodeParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });

                if (result.status === 206) {
                    setTimeout(() => {
                        CommonUtilities.showAlert("This number is already verified");
                        // setTimeout(() => {
                        this.props.navigation.goBack();
                        // }, 200);
                    }, 200);
                } else {
                    if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                        setTimeout(() => {
                            CommonUtilities.showAlert(result.data.messageAr, false);
                        }, 200);
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(result.data.message, false);
                        }, 200);
                    }
                }
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(error.data["message"], false);
                        }, 200);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Something went wrong, plese try again");
                }
            }
        );
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
        ["code"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { errors = {}, code } = this.state;
        let countDownValue = this.state.counter > 0 ? " " + this.state.counter : "";
        let callMeBGColor = this.state.counter > 0 ? constant.buttonDisableColor : constant.themeColor;

        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner
                    visible={this.state.visible}
                    cancelable={true}
                    // textContent={"Please wait..."}
                    textStyle={{ color: "#FFF" }}
                />
                {/* // Enter confirmation code Text */}
                <View style={styles.navigationView}>
                    <TouchableOpacity
                        style={{ width: 60, height: 80, alignItems: "center", justifyContent: "center" }}
                        onPress={this.onPressBack}
                    >
                        <Image
                            style={{ width: 25, height: 25 }}
                            source={require("../../Resources/Images/HomeScr/BtnBack.png")}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                    {/* // Enter confirmation code Text */}
                    <Text
                        style={{
                            textAlign: "left",
                            fontFamily: "Ebrima",
                            fontSize: 15,
                            color: "black",
                            marginTop: 30,
                        }}
                    >
                        {baseLocal.t("Enter confirmation code")}
                    </Text>

                    <View style={{ width: "80%" }}>
                        {/* // Email Text Field */}
                        <AppTextField
                            reference={this.codeRef}
                            label={baseLocal.t("Confirmation code")}
                            baseColor={constant.themeColor}
                            tintColor={constant.themeColor}
                            textColor={constant.themeColor}
                            value={this.state.code}
                            returnKeyType="next"
                            keyboardType="numeric"
                            onSubmitEditing={this.onSubmitCode}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                            autoFocus={true}
                        />
                    </View>

                    {/* // Next and Call Me Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Next Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressNext}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("Next")}
                            </Text>
                        </TouchableOpacity>

                        {/* // Call Me Button */}
                        <TouchableOpacity
                            style={[styles.signUpButtonStyle, { backgroundColor: callMeBGColor }]}
                            onPress={this.onPressCallMe}
                        >
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("CALL ME") + countDownValue}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* // Enter confirmation code Text */}
                    <TouchableOpacity style={{ width: "80%" }} onPress={this.onPressResend}>
                        <Text
                            style={{
                                fontFamily: "Ebrima",
                                fontSize: 13,
                                color: callMeBGColor,
                                marginTop: 20,
                                textAlign: "center",
                            }}
                        >
                            {baseLocal.t(
                                "Didn’t receive Confirmation code? Please wait for 30 seconds and if you don’t receive it, then you can resend it or click on Call Me"
                            )}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        login: state.dataReducer.login,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VerifyCodeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EDEDED",
    },
    signUpButtonStyle: {
        width: "45%",
        marginTop: 20,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: constant.themeColor,
        borderRadius: 20,
    },
    scrollView: {
        flexGrow: 1,
        // justifyContent: "center",
        alignItems: "center",
        // height: Dimensions.get("window").height,
    },
    navigationView: {
        backgroundColor: constant.themeColor,
        width: Dimensions.get("window").width,
        height: 64,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
});
