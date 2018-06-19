/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, Image, Button, TouchableOpacity, Alert, ScrollView } from "react-native";

import AppTextField from "../../Components/AppTextField";
import constant from "../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../AppRedux/Actions/actions";

// Device Info
var DeviceInfo = require("react-native-device-info");

// Common Utilities
import CommonUtilities, { validateEmail } from "../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// Localization
import baseLocal from '../../Resources/Localization/baseLocalization'

// FBSDK
const FBSDK = require("react-native-fbsdk");
const { LoginManager, GraphRequest, GraphRequestManager, AccessToken } = FBSDK;

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        baseLocal.locale = 'ar'
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressSignup = this.onPressSignup.bind(this);
        this.onPressForgotPassword = this.onPressForgotPassword.bind(this);
        this.onPressLoginWithFB = this.onPressLoginWithFB.bind(this);
        this.checkFBIdExistance = this.checkFBIdExistance.bind(this);
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
            visible: false,
        };
    }

    componentDidUpdate() {
        // constant.debugLog("Login Status : ", this.props.login);
        // AsyncStorage.setItem(constant.isLogin, "true");
    }

    componentDidMount() {
        this.setState({
            email: "test@user.com",
            password: "123456",
        });
    }

    onPressLogin() {
        if (!validateEmail(this.state.email)) {
            Alert.alert(constant.alertTitle, "Invalid email id");
            return;
        }

        if (this.state.password === "") {
            Alert.alert(constant.alertTitle, "Password cannot be blank");
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

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.login, loginParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });
                global.loginKey = result.data.data.userData.loginKey;
                AsyncStorage.setItem(constant.keyCurrentUser, JSON.stringify(result.data.data.userData));
                AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data.settingData));
                AsyncStorage.removeItem(constant.keyCurrentStore);
                constant.debugLog("User Login Success");
                this.props.navigation.navigate("CityScreen");
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        alert(error.data["messageAr"]);
                    } else {
                        setTimeout(() => {
                            alert(error.data["message"]);
                        }, 200);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    alert("Something went wrong, plese try again");
                }
            }
        );
    }

    onPressLoginWithFB() {
        // Show Loading View
        this.setState({ visible: true });
        LoginManager.logInWithReadPermissions(["public_profile"]).then(
            result => {
                if (result.isCancelled) {
                    alert("Login cancelled");
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        let accessToken = data.accessToken;

                        const responseInfoCallback = (error, result) => {
                            if (error) {
                                constant.debugLog(error);
                                alert("Error fetching data: " + error.toString());
                            } else {
                                constant.debugLog(result);
                                this.props.navigation.navigate("SignUpScreen", { fbResult: result });
                            }
                        };

                        const infoRequest = new GraphRequest(
                            "/me",
                            {
                                accessToken: accessToken,
                                parameters: {
                                    fields: {
                                        string: "email,name,first_name,middle_name,last_name",
                                    },
                                },
                            },
                            this.checkFBIdExistance
                        );

                        // Start the graph request.
                        new GraphRequestManager().addRequest(infoRequest).start();
                    });
                }
            },
            error => {
                alert("Login fail with error: " + error);
            }
        );
    }

    checkFBIdExistance = (error, fbResult) => {
        if (error) {
            constant.debugLog(error);
            alert("Error fetching data: " + error.toString());
        } else {
            constant.debugLog(fbResult);
            var checkFBIdParameters = {
                facebookId: fbResult["id"],
                deviceType: Platform.OS === "ios" ? constant.deviceTypeiPhone : constant.deviceTypeAndroid,
                notifyId: constant.notifyId,
                timeZone: constant.timeZone,
                appVersion: DeviceInfo.appVersion === undefined ? "0.0" : DeviceInfo.appVersion,
            };

            networkUtility.postRequest(constant.verifyFBId, checkFBIdParameters).then(
                result => {
                    // Hide Loading View
                    this.setState({ visible: false });

                    if (result.status == 206) {
                        this.props.navigation.navigate("SignUpScreen", { fbResult: fbResult });
                    } else {
                        global.loginKey = result.data.data.userData.loginKey;
                        AsyncStorage.setItem(constant.keyCurrentUser, JSON.stringify(result.data.data.userData));
                        AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data.settingData));
                        AsyncStorage.removeItem(constant.keyCurrentStore);
                        constant.debugLog("FB User Login Success");
                        this.props.navigation.navigate("CityScreen");
                    }
                },
                error => {
                    // Show Loading View
                    this.setState({ visible: false });

                    constant.debugLog("Status Code: " + error.status);
                    constant.debugLog("Error Message: " + error.message);
                    if (error.status != 500) {
                        if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                            alert(error.data["messageAr"]);
                        } else {
                            setTimeout(() => {
                                alert(error.data["message"]);
                            }, 200);
                        }
                    } else {
                        constant.debugLog("Internal Server Error: " + error.data);
                        alert("Something went wrong, plese try again");
                    }
                }
            );
        }
    };

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
                    visible={this.state.visible}
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
                        onPress={this.onPressLoginWithFB}
                    >
                        <View style={styles.fbButtonStyle}>
                            <Image
                                style={{ width: 15, height: 15, marginRight: 15 }}
                                source={require("../../Resources/Images/FBIcon.png")}
                            />
                            <Text style={{ color: "#405798", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                Login with facebook{" "}
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
                            <Text style={{ color: "#CF2526", fontFamily: "Ebrima", fontSize: 10 }}> OR </Text>
                        </View>
                        <View style={{ width: "40%", height: 1, backgroundColor: "#EAEAEA", marginTop: 10 }}> </View>
                    </View>

                    <View style={{ width: "80%" }}>
                        {/* // Email Text Field */}
                        <AppTextField
                            reference={this.emailRef}
                            label="Email Id"
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
                            label="Password"
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
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>{baseLocal.t('Login')}</Text>
                    </TouchableOpacity>

                    {/* // Forgot Password and Signup Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Forgot Password Button */}
                        <TouchableOpacity onPress={this.onPressForgotPassword}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 15 }}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* // Signup Button */}
                        <TouchableOpacity onPress={this.onPressSignup}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 15 }}>Sign Up</Text>
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
                            Continue as guest user
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
