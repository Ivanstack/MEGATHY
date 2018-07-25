/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions, Keyboard } from "react-native";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";

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
            oldPswVisible: true,
            newPswVisible: true,
            confirmPswVisible: true,
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Change Password"), true);

    componentDidMount() {
        // this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);
    }

    componentWillReceiveProps(newProps) {}

    // Misc Methods
    _onChangeText = text => {
        ["oldPsw", "newPsw", "confirmPsw"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            // constant.debugLog("Name :==> " + name);
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
        // Keyboard.dismiss();
        // this._onPressSend();
    };

    _validateAllTextInput = () => {
        if (this.state.oldPsw === "") {
            CommonUtilities.showAlert("Old Password cannot be blank");
            return false;
        } else if (this.state.newPsw === "") {
            CommonUtilities.showAlert("New Password cannot be blank");
            return false;
        } else if (this.state.newPsw != this.state.confirmPsw) {
            CommonUtilities.showAlert("Password and confirm password do not match");
            return false;
        } else {
            return true;
        }
    };

    _updateRef = (name, ref) => {
        this[name] = ref;
    };

    // OnPress Methods

    _onPressChangeBtn = () => {
        if (this.state.oldPsw === "") {
            CommonUtilities.showAlert("Old Password cannot be blank");
            // return false;
        } else if (this.state.newPsw === "") {
            CommonUtilities.showAlert("New Password cannot be blank");
            // return false;
        } else if (this.state.newPsw != this.state.confirmPsw) {
            CommonUtilities.showAlert("Password and confirm password do not match");
            // return false;
        } else {
            var changePasswordParameters = {
                oldPassword: this.state.oldPsw,
                newPassword: this.state.newPsw,
            };

            this.props.changePassword(changePasswordParameters);
            this.props.navigation.pop();
        }
    };

    _onPressShowText = txtInput => {
        // this.setState({ oldPswVisible: this.state.oldPswVisible });

        switch (txtInput) {
            case "oldPsw":
                this.setState({ oldPswVisible: !this.state.oldPswVisible });
                break;
            case "newPsw":
                this.setState({ newPswVisible: !this.state.newPswVisible });
                break;
            case "confirmPsw":
                this.setState({ confirmPswVisible: !this.state.confirmPswVisible });
                break;

            default:
                break;
        }
    };

    renderPasswordAccessory(name) {
        let eyeImage = require("../../../../Resources/Images/LoginScreen/EyeOpenRed.png");
        switch (name) {
            case "oldPsw":
                eyeImage = this.state.oldPswVisible
                    ? require("../../../../Resources/Images/LoginScreen/EyeOpenRed.png")
                    : require("../../../../Resources/Images/LoginScreen/EyeClosedRed.png");
                break;
            case "newPsw":
                eyeImage = this.state.newPswVisible
                    ? require("../../../../Resources/Images/LoginScreen/EyeOpenRed.png")
                    : require("../../../../Resources/Images/LoginScreen/EyeClosedRed.png");
                break;
            case "confirmPsw":
                eyeImage = this.state.confirmPswVisible
                    ? require("../../../../Resources/Images/LoginScreen/EyeOpenRed.png")
                    : require("../../../../Resources/Images/LoginScreen/EyeClosedRed.png");
                break;

            default:
                break;
        }
        let showImg = false;
        if (this[name] != undefined && this[name].value() != "") {
            showImg = true;
        }
        // let eyeImage = this.state.oldPswVisible
        //     ? require("../../../../Resources/Images/LoginScreen/EyeClosedRed.png")
        //     : require("../../../../Resources/Images/LoginScreen/EyeOpenRed.png");

        return (
            <TouchableOpacity onPress={() => this._onPressShowText(name)}>
                {showImg === true ? <Image style={{ height: 20, width: 20 }} source={eyeImage} /> : null}
            </TouchableOpacity>
        );
    }

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
                        secureTextEntry={this.state.oldPswVisible}
                        returnKeyType="done"
                        onSubmitEditing={this._onSubmitOldPsw}
                        onChangeText={this._onChangeText}
                        renderAccessory={this.renderPasswordAccessory.bind(this, "oldPsw")}
                    />

                    {/* // New Password Text Field */}
                    {/* <View style={{ flexDirection: "row" }}> */}
                    <AppTextField
                        style={{ marginTop: -20, backgroundColor: "pink" }}
                        reference={this.newPswRef}
                        label={baseLocal.t("New Password")}
                        value={this.state.newPsw}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        secureTextEntry={this.state.newPswVisible}
                        returnKeyType="done"
                        onSubmitEditing={this._onSubmitNewPsw}
                        onChangeText={this._onChangeText}
                        renderAccessory={this.renderPasswordAccessory.bind(this, "newPsw")}
                    />
                    {/* <TouchableOpacity style={{ position: "absolute", right: 0 }}>
                            <Image
                                style={{ height: 20, width: 20 }}
                                source={require("../../../../Resources/Images/LoginScreen/EyeOpenRed.png")}
                            />
                        </TouchableOpacity> */}
                    {/* </View> */}
                    {/* // Confirm Password Text Field */}
                    <AppTextField
                        style={{ marginTop: -20, backgroundColor: "blue" }}
                        reference={this.confirmPswRef}
                        label={baseLocal.t("Confirm Password")}
                        value={this.state.confirmPsw}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        secureTextEntry={this.state.confirmPswVisible}
                        returnKeyType="done"
                        // onSubmitEditing={this._onSubmitComment}
                        onChangeText={this._onChangeText}
                        renderAccessory={this.renderPasswordAccessory.bind(this, "confirmPsw")}
                    />
                </View>
                {/* // Change Password Button */}
                <TouchableOpacity style={ChangePasswordStyle.updateButtonStyle} onPress={this._onPressChangeBtn}>
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
        changePassword: parameters =>
            dispatch({
                type: constant.actions.changePasswordRequest,
                payload: { endPoint: constant.APIChangePassword, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePasswordScreen);
