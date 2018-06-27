/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, Image, TouchableOpacity, Alert, ScrollView } from "react-native";

import AppTextField from "../../Components/AppTextField";
import constant from "../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../AppRedux/Actions/actions";

// Device Info
var DeviceInfo = require("react-native-device-info");

// Common Utilities
import * as CommonUtilities from "../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// Localization
import baseLocal from "../../Resources/Localization/baseLocalization";

// FBSDK
const FBSDK = require("react-native-fbsdk");
const { LoginManager, GraphRequest, GraphRequestManager, AccessToken } = FBSDK;

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressSignup = this.onPressSignup.bind(this);
        this.onPressForgotPassword = this.onPressForgotPassword.bind(this);
        this.onPressLogin = this.onPressLogin.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
        this.emailRef = this.updateRef.bind(this, "email");
        this.passwordRef = this.updateRef.bind(this, "password");
        this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

        this.state = {
            secureTextEntry: true,
            email: "",
            password: "",
        };
    }

    componentDidMount() {
        this.setState({
            email: "test@user.com",
            password: "123456",
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isLogin === true) {
            this.props.navigation.navigate("CityScreen");
        }
    }

    onPressLogin() {
        if (!CommonUtilities.validateEmail(this.state.email)) {
            CommonUtilities.showAlert("Invalid email id");
            return;
        }

        if (this.state.password === "") {
            CommonUtilities.showAlert("Password cannot be blank");
            return;
        }

        var loginParameters = {
            email: this.state.email,
            password: this.state.password,
            deviceType: Platform.OS === "ios" ? constant.deviceTypeiPhone : constant.deviceTypeAndroid,
            notifyId: constant.notifyId,
            timeZone: constant.timeZone,
            vendorId: DeviceInfo.getUniqueID(),
            appVersion: DeviceInfo.appVersion === undefined ? "0.0" : DeviceInfo.appVersion,
        };

        this.props.onLogin(loginParameters);
    }

    onPressSignup() {
        this.props.navigation.navigate("SignUpScreen");
    }

    onPressForgotPassword() {
        this.props.navigation.navigate("ForgotPasswordScreen");
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
        ["email", "password"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    }

    onSubmitEmail() {
        this.password.focus();
    }

    onSubmitPassword() {
        this.password.blur();
        this.onPressLogin();
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
        let { errors = {}, secureTextEntry, email, password } = this.state;

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

                    {/* // FB Button */}
                    <TouchableOpacity
                        style={{ width: "82%", height: 40, marginTop: 25 }}
                        onPress={() => this.props.onFBLogin()}
                    >
                        <View style={styles.fbButtonStyle}>
                            <Image
                                style={{ width: 15, height: 15, marginRight: 15 }}
                                source={require("../../Resources/Images/FBIcon.png")}
                            />
                            <Text style={{ color: "#405798", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                {baseLocal.t("Login with facebook")}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* // OR seperator */}
                    <View style={{ flexDirection: "row", width: "80%", height: 20, marginTop: 20 }}>
                        <View
                            style={{
                                width: "40%",
                                height: 1,
                                backgroundColor: "#EAEAEA",
                                marginTop: 10,
                                marginRight: "5%",
                            }}
                        >
                            {" "}
                        </View>
                        <View
                            style={{
                                backgroundColor: "#EAEAEA",
                                marginRight: "5%",
                                height: 26,
                                width: 28,
                                borderRadius: 13,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#CF2526", fontFamily: "Ebrima", fontSize: 10 }}>
                                {" "}
                                {baseLocal.t("OR")}{" "}
                            </Text>
                        </View>
                        <View style={{ width: "40%", height: 1, backgroundColor: "#EAEAEA", marginTop: 10 }}> </View>
                    </View>

                    <View style={{ width: "80%" }}>
                        {/* // Email Text Field */}
                        <AppTextField
                            reference={this.emailRef}
                            label={baseLocal.t("Email Id")}
                            value={this.state.email}
                            returnKeyType="next"
                            keyboardType="email-address"
                            onSubmitEditing={this.onSubmitEmail}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />

                        {/* // Password Text Field */}
                        <AppTextField
                            reference={this.passwordRef}
                            label={baseLocal.t("Password")}
                            value={this.state.password}
                            returnKeyType="done"
                            clearTextOnFocus={true}
                            secureTextEntry={secureTextEntry}
                            onSubmitEditing={this.onSubmitPassword}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />
                    </View>

                    {/* // Login Button */}
                    <TouchableOpacity style={styles.loginButtonStyle} onPress={this.onPressLogin}>
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                            {baseLocal.t("Login")}
                        </Text>
                    </TouchableOpacity>

                    {/* // Forgot Password and Signup Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Forgot Password Button */}
                        <TouchableOpacity onPress={this.onPressForgotPassword}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 15 }}>
                                {baseLocal.t("Forgot Password?")}
                            </Text>
                        </TouchableOpacity>

                        {/* // Signup Button */}
                        <TouchableOpacity onPress={this.onPressSignup}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 15 }}>
                                {baseLocal.t("Sign Up")}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* // Continue as guest user Button */}
                    <TouchableOpacity
                        style={styles.loginButtonStyle}
                        onPress={() => {
                            alert("Continue as guest user");
                        }}
                    >
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                            {baseLocal.t("Continue as guest user")}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.login.isLoading,
        isLogin: state.login.isLogin,
    };
}

function mapDispatchToProps(dispatch) {
    // return bindActionCreators(actions, dispatch);
    return {
        onLogin: parameters =>
            dispatch({ type: "LOGIN_CALL_REQUEST", payload: { endPoint: constant.APILogin, parameters: parameters } }),
        onFBLogin: () => dispatch({ type: "FB_LOGIN_CALL_REQUEST", payload: { endPoint: constant.APIVerifyFBId } }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CF2526",
    },
    fbButtonStyle: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#EAEAEA",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    loginButtonStyle: {
        width: "82%",
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
