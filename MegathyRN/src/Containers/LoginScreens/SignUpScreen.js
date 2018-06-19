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

// Common Utilities
import * as CommonUtilities from '../../Helper/CommonUtilities'

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Localization
import baseLocal from '../../Resources/Localization/baseLocalization'

class SignUpScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressSignUp = this.onPressSignUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
        this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

        this.onSubmitFullName = this.onSubmitFullName.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPhone = this.onSubmitPhone.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onSubmitConfirmPassword = this.onSubmitConfirmPassword.bind(this);

        this.fullNameRef = this.updateRef.bind(this, "fullName");
        this.emailRef = this.updateRef.bind(this, "email");
        this.phoneRef = this.updateRef.bind(this, "phone");
        this.passwordRef = this.updateRef.bind(this, "password");
        this.confirmPasswordRef = this.updateRef.bind(this, "confirmPassword");

        this.state = {
            secureTextEntry: true,
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            fbId: "",
            visible: false,
        };
    }

    componentDidUpdate() {}

    componentDidMount() {
        let fbResult = this.props.navigation.getParam("fbResult", "noFB");
        if (fbResult != "noFB") {
            this.setState({
                fbId: fbResult["id"],
                fullName: fbResult["name"],
                email: fbResult["email"],
            });
        }
    }

    onPressSignUp() {
        if (this.state.fullName.trim() === "") {
            CommonUtilities.showAlert('Full Name cannot be blank')
            return;
        }

        if (!CommonUtilities.validateEmail(this.state.email)) {
            CommonUtilities.showAlert('Invalid email id')
            return;
        }

        if (this.state.phone === "") {
            CommonUtilities.showAlert('Please register phone number first')
            return;
        }

        if (this.props.navigation.getParam("fbResult") === undefined) {
            if (this.state.password === "") {
                CommonUtilities.showAlert('Password cannot be blank')
                return;
            }

            if (this.state.password != this.state.confirmPassword) {
                CommonUtilities.showAlert('Password and confirm password do not match')
                return;
            }
        }

        var registerParameters = {
            userName: this.state.fullName,
            email: this.state.email,
            phone: this.state.email,
            deviceType: Platform.OS === "ios" ? constant.deviceTypeiPhone : constant.deviceTypeAndroid,
            notifyId: constant.notifyId,
            timeZone: constant.timeZone,
            vendorId: DeviceInfo.getUniqueID(),
            appVersion: DeviceInfo.appVersion === undefined ? "0.0" : DeviceInfo.appVersion,
        };

        if (this.state.fbId === "") {
            registerParameters["type"] = "user";
            registerParameters["password"] = this.state.password;
        } else {
            registerParameters["type"] = "facebook";
            registerParameters["facebookId"] = this.state.fbId;
        }

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.register, registerParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });

                global.loginKey = result.data.data.userData.loginKey;
                AsyncStorage.setItem(constant.keyCurrentUser, JSON.stringify(result.data.data.userData));
                AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data.settingData));
                AsyncStorage.removeItem(constant.keyCurrentStore);
                constant.debugLog("User Signup Success");
                this.props.navigation.navigate("CityScreen");
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false)
                    } else {
                        setTimeout(() => {
                            CommonUtilities.showAlert(error.data["message"], false)
                        }, 200);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert('Opps! something went wrong')
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
        var arrTextFieldRef = [];
        if (this.props.navigation.getParam("fbResult") === undefined) {
            arrTextFieldRef = ["fullName", "email", "phone", "password", "confirmPassword"];
        } else {
            arrTextFieldRef = ["fullName", "email", "phone"];
        }

        arrTextFieldRef.map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    }

    onSubmitFullName() {
        this.email.focus();
    }

    onSubmitEmail() {
        this.phone.focus();
    }

    onSubmitPhone() {
        this.password.focus();
    }

    onSubmitPassword() {
        this.confirmPassword.focus();
    }

    onSubmitConfirmPassword() {
        this.confirmPassword.blur();
        this.onPressSignUp();
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
        let { errors = {}, secureTextEntry, fullName, email, password } = this.state;

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
                        {baseLocal.t('Sign Up')}
                    </Text>

                    <View style={{ width: "80%" }}>
                        {/* // Full Name Text Field */}
                        <AppTextField
                            reference={this.fullNameRef}
                            label={baseLocal.t('Full Name')}
                            value={this.state.fullName}
                            returnKeyType="next"
                            onSubmitEditing={this.onSubmitFullName}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />

                        {/* // Email Text Field */}
                        <AppTextField
                            reference={this.emailRef}
                            label={baseLocal.t('Email Id')}
                            value={this.state.email}
                            returnKeyType="next"
                            keyboardType="email-address"
                            onSubmitEditing={this.onSubmitEmail}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />

                        {/* // Phone No Text Field */}
                        <AppTextField
                            reference={this.phoneRef}
                            label={baseLocal.t('Phone No')}
                            value={this.state.phone}
                            returnKeyType="next"
                            keyboardType="numeric"
                            onSubmitEditing={this.onSubmitPhone}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />

                        {this.props.navigation.getParam("fbResult") === undefined ? (
                            // {/* // Password Text Field */}
                            <View>
                                <AppTextField
                                    reference={this.passwordRef}
                                    label={baseLocal.t('Password')}
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
                                    label={baseLocal.t('Confirm Password')}
                                    value={this.state.confirmPassword}
                                    returnKeyType="done"
                                    clearTextOnFocus={true}
                                    secureTextEntry={secureTextEntry}
                                    onSubmitEditing={this.onSubmitConfirmPassword}
                                    onChangeText={this.onChangeText}
                                    onFocus={this.onFocus}
                                />
                            </View>
                        ) : null}
                    </View>

                    {/* // Back and SignU[] Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Back Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressBack}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>{baseLocal.t('Back')}</Text>
                        </TouchableOpacity>

                        {/* // Sign Up Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressSignUp}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>{baseLocal.t('Sign Up')}</Text>
                        </TouchableOpacity>
                    </View>
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
)(SignUpScreen);

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
