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
import CommonUtilities, { validateEmail } from "../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

class VerifyCodeScreen extends Component {
    constructor(props) {
        super(props);

        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.onPressBack = this.onPressBack.bind(this);
        this.onPressNext = this.onPressNext.bind(this);
        this.onPressCallMe = this.onPressCallMe.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.codeRef = this.updateRef.bind(this, "code");

        this.state = {
            code: "",
            visible: false,
        };
    }

    onPressNext() {
        /*
        if (!validateEmail(this.state.email)) {
            Alert.alert(constant.alertTitle, "Invalid email id");
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
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage != "en" && error.data["messageAr"] != undefined) {
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
        */
    }

    onPressCallMe() {
        /*
        if (!validateEmail(this.state.email)) {
            Alert.alert(constant.alertTitle, "Invalid email id");
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
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage != "en" && error.data["messageAr"] != undefined) {
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
                <View style={styles.navigationView} />

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
                        Enter confirmation code
                    </Text>

                    <View style={{ width: "80%" }}>
                        {/* // Email Text Field */}
                        <AppTextField
                            reference={this.codeRef}
                            label="Confirmation code"
                            baseColor="#CF2526"
                            tintColor="#CF2526"
                            value={this.state.code}
                            returnKeyType="next"
                            keyboardType="numeric"
                            onSubmitEditing={this.onSubmitCode}
                            onChangeText={this.onChangeText}
                            onFocus={this.onFocus}
                        />
                    </View>

                    {/* // Next and Call Me Buttons View */}
                    <View
                        style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}
                    >
                        {/* // Next Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressNext}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>Next</Text>
                        </TouchableOpacity>

                        {/* // Call Me Button */}
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressCallMe1}>
                            <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>Call Me</Text>
                        </TouchableOpacity>
                    </View>

                    {/* // Enter confirmation code Text */}
                    <TouchableOpacity style={{width:"80%"}} onPress={this.onPressNext}>
                        <Text
                            style={{
                                fontFamily: "Ebrima",
                                fontSize: 13,
                                color: constant.themeColor,
                                marginTop: 20,
                                textAlign: "center",
                            }}
                        >
                            Didn’t receive Confirmation code? Please wait for 30 seconds and if you don’t receive it,
                            then you can resend it or click on Call Me
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
        backgroundColor: "#99050D",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    scrollView: {
        flexGrow: 1,
        // justifyContent: "center",
        alignItems: "center",
        // height: Dimensions.get("window").height,
    },
    navigationView: {
        backgroundColor: "#CF2526",
        width: Dimensions.get("window").width,
        height: 64,
    },
});
