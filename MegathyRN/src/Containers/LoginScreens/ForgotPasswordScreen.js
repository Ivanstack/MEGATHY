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
import baseLocal from "../../Resources/Localization/baseLocalization";

class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressReset = this.onPressReset.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.emailRef = this.updateRef.bind(this, "email");

        this.state = {
            email: "",
            visible: false,
        };
    }

    componentDidUpdate() {}

    onPressReset() {
        if (!CommonUtilities.validateEmail(this.state.email)) {
            CommonUtilities.showAlert('Invalid email id')
            return;
        }
        var forgotPasswordParameters = {
            email: this.state.email,
            vendorId: DeviceInfo.getUniqueID(),
        };

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.forgotPassword, forgotPasswordParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });
                this.props.navigation.navigate("VerifyCodeScreen", result.data.data);
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
                    CommonUtilities.showAlert("Opps! something went wrong")
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
        ["email"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    }

    onSubmitEmail() {
        this.email.blur();
        this.onPressReset();
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
                            reference={this.emailRef}
                            label={baseLocal.t("Email Id")}
                            value={this.state.email}
                            returnKeyType="next"
                            keyboardType="email-address"
                            onSubmitEditing={this.onSubmitEmail}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />
                    </View>

                    {/* // Back and Reset Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Back Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressBack}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>{baseLocal.t('Back')}</Text>
                        </TouchableOpacity>

                        {/* // Reset Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressReset}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>{baseLocal.t('Reset')}</Text>
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
