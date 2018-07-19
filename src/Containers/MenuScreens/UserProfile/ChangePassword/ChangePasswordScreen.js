/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions, Keyboard } from "react-native";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import ChangePasswordStyle from "./ChangePasswordStyle";
import AppTextField from "../../../../Components/AppTextField"; // Custom Text Field
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager

class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.oldPswRef = this._updateRef.bind(this, "oldPsw");
        this.newPswRef = this._updateRef.bind(this, "newPsw");
        this.confirmPswRef = this._updateRef.bind(this, "confirmPsw");

        this.state = {
            oldPsw: "",
            newPsw: "",
            confirmPsw: "",
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Change Password"), true);

    componentDidMount() {}

    componentWillReceiveProps(newProps) {}

    // Misc Methods
    _onChangeText = text => {
        ["oldPsw", "newPsw", "confirmPsw"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            constant.debugLog("Name :==> " + name);
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    };

    _onSubmitOldPsw = () => {
        this.newPsw.focus();
    };

    _onSubmitNewPsw = () => {
        this.confirmPsw.focus();
    };

    _onSubmitConfirmPsw = () => {
        Keyboard.dismiss();
        // this._onPressSend();
    };

    // _onPressSend = () => {
    //     if (!CommonUtilities.validateEmail(this.state.email)) {
    //         CommonUtilities.showAlert("Invalid email id");
    //         return;
    //     }

    //     if (this.state.comment.trim() === "") {
    //         CommonUtilities.showAlert("Comment cannot be blank");
    //         return;
    //     }

    //     let contactUsParameters = {
    //         email: this.state.email,
    //         description: this.state.comment,
    //     };
    //     this.props.contactUs(contactUsParameters);
    // };

    _updateRef = (name, ref) => {
        this[name] = ref;
    };

    render() {
        return (
            // Main View (Container)
            // Main View (Container)
            <View style={ChangePasswordStyle.container}>
                <Spinner
                    visible={this.props.isLoading}
                    cancelable={true}
                    // textContent={"Please wait..."}
                    textStyle={{ color: "#FFF" }}
                />
                {/* <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}> */}
                <View style={{ width: "90%" }}>
                    {/* // Old Password Text Field */}
                    <AppTextField
                        reference={this.oldPswRef}
                        label={baseLocal.t("Old Password")}
                        value={this.state.oldPsw}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        secureTextEntry={true}
                        returnKeyType="done"
                        onSubmitEditing={this._onSubmitOldPsw}
                        onChangeText={this._onChangeText}
                    />
                    {/* // New Password Text Field */}
                    <AppTextField
                        style={{ marginTop: -20, backgroundColor: "pink" }}
                        reference={this.newPswRef}
                        label={baseLocal.t("New Password")}
                        value={this.state.newPsw}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        secureTextEntry={true}
                        returnKeyType="done"
                        onSubmitEditing={this._onSubmitNewPsw}
                        onChangeText={this._onChangeText}
                    />

                    {/* // Confirm Password Text Field */}
                    <AppTextField
                        style={{ marginTop: -20, backgroundColor: "blue" }}
                        reference={this.confirmPswRef}
                        label={baseLocal.t("Confirm Password")}
                        value={this.state.confirmPsw}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        secureTextEntry={true}
                        returnKeyType="done"
                        // onSubmitEditing={this._onSubmitComment}
                        onChangeText={this._onChangeText}
                    />
                </View>
                {/* // Change Password Button */}
                <TouchableOpacity style={ChangePasswordStyle.updateButtonStyle}>
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "Ebrima",
                            fontWeight: "bold",
                        }}
                    >
                        {baseLocal.t("Change")}
                    </Text>
                </TouchableOpacity>
                {/* </ScrollView> */}
            </View>
        );
    }
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
)(ChangePasswordScreen);
