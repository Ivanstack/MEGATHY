/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions, Keyboard } from "react-native";
import { Text, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager
import AppTextField from "../../../../Components/AppTextField"; // Custom Text Field
import ThemeButton from "../../../../Components/ThemeButton"; // Theme Button

import { Popover, PopoverContainer } from "react-native-simple-popover";

const popoverPlacement = "bottom";
const initialCounterValue = 30;
const callMeNote =
    "Didn’t receive Confirmation code? Please wait for 30 seconds and if you don’t receive it, then you can resend it or click on Call Me";
class VerifyPhoneScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        lastValidPhone = "";
        this.timer = undefined;
        this.state = {
            phone: "",
            code: "",
            counter: 0,
            selectedCountry: constant.countryDetails.SA,
            isPopoverVisible: false,
            isCodeSectionVisible: false,
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Location"), true);

    componentDidMount = () => {};
    componentWillReceiveProps = newProps => {};
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentWillReceiveProps = newProps => {
        let result = newProps.verifyPhoneState.result === undefined ? null : newProps.verifyPhoneState.result;
        if (newProps.verifyPhoneState.isVPSuccess === true && result != null) {
            if (result.status === 206) {
                CommonUtilities.showAlert("This number is already verified");
                let callBackFunction = this.props.navigation.getParam("callBackFunction", null);
                if (callBackFunction != null) {
                    callBackFunction(this.state.selectedCountry.dialCode + this._phoneWithoutMask(this.state.phone));
                }
                this.props.navigation.goBack();
            } else {
                if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                    CommonUtilities.showAlert(result.data.messageAr, false);
                } else {
                    CommonUtilities.showAlert(result.data.message, false);
                }
                lastValidPhone = this.state.selectedCountry.dialCode + this._phoneWithoutMask(this.state.phone);
                if (this.timer === undefined) {
                    this.setState(
                        {
                            counter: initialCounterValue,
                            isCodeSectionVisible: true,
                        },
                        () => (this.timer = setInterval(this._changeTimeInterval, 1000))
                    );
                }
            }
        } else if (newProps.verifyPhoneState.isVCSuccess === true && result != null) {
            if (result.status === 200) {
                let callBackFunction = this.props.navigation.getParam("callBackFunction", null);
                if (callBackFunction != null) {
                    callBackFunction(this.state.selectedCountry.dialCode + this._phoneWithoutMask(this.state.phone));
                }
                this.props.navigation.goBack();
            } else {
                if (global.currentAppLanguage === constant.languageArabic && result.data.messageAr != undefined) {
                    CommonUtilities.showAlert(result.data.messageAr, false);
                } else {
                    CommonUtilities.showAlert(result.data.message, false);
                }
            }
        }
    };

    _changeTimeInterval = () => {
        if (this.state.counter == 0) {
            clearInterval(this.timer);
            this.timer = undefined;
            return;
        }
        this.setState({
            counter: this.state.counter - 1,
        });
    };

    _counterValue = () => {
        if (this.state.counter > 0) {
            var counterValue = " 00:" + String(this.state.counter);
            if (this.state.counter < 10) {
                counterValue = " 00:0" + String(this.state.counter);
            }

            return counterValue;
        }

        return "";
    };

    _showPopover = () => {
        this.setState({
            isPopoverVisible: true,
        });
    };

    _closePopover = value => {
        this.setState({ isPopoverVisible: false, selectedCountry: value }, () => {
            this._onChangePhone(this._phoneWithoutMask(this.state.phone));
        });
    };

    _onChangePhone = text => {
        var maskedPhone = "";
        if (this.state.selectedCountry.code === "IN") {
            var x = text.replace(/\D/g, "").match(/(\d{0,5})(\d{0,5})/);
            maskedPhone = x[1] + " " + x[2];
        } else {
            var x = text.replace(/\D/g, "").match(/(\d{0,2})(\d{0,3})(\d{0,4})/);
            maskedPhone = x[1] + " " + x[2] + " " + x[3];
        }

        if (maskedPhone.length === 11) {
            newPhone = this.state.selectedCountry.dialCode + this._phoneWithoutMask(maskedPhone);
            this.setState({
                isCodeSectionVisible: newPhone === lastValidPhone ? true : false,
            });
        }
        this.setState({
            phone: maskedPhone,
        });
    };

    _onChangeCode = text => {
        this.setState({ code: text });
    };

    _onSubmitCode = () => {
        Keyboard.dismiss();
        this._onPressSubmit();
    };

    _phoneWithoutMask = text => {
        return String(text).replace(" ", "");
    };

    _updateRef = (name, ref) => {
        this[name] = ref;
    };

    _onPressSubmit = () => {
        if (this.state.code.trim() === "") {
            CommonUtilities.showAlert("Please enter confirmation code");
            return;
        }

        let APIConfirmationType = this.props.navigation.getParam("confirmationType", "");

        if (APIConfirmationType === "") {
            constant.debugLog("Something is wrong with response from previous screen");
            return;
        }

        var verifyCodeParameters = {
            phone: this.state.selectedCountry.dialCode + this._phoneWithoutMask(this.state.phone),
            vendorId: constant.DeviceInfo.getUniqueID(),
            type: APIConfirmationType,
            code: this.state.code,
        };

        this.props.onVerifyCode(verifyCodeParameters);
    };

    _onPressCallMe = () => {
        let APIConfirmationType = this.props.navigation.getParam("confirmationType", "");
        if (APIConfirmationType === "") {
            CommonUtilities.showAlert("Something is wrong with response from previous screen", false);
        }

        if (this.state.counter > 0) {
            return;
        }

        var resendCodeParameters = {
            phone: this.state.selectedCountry.dialCode + this._phoneWithoutMask(this.state.phone),
            vendorId: constant.DeviceInfo.getUniqueID(),
            type: APIConfirmationType,
            requestBy: "call",
        };

        this.props.onVerifyPhone(resendCodeParameters);
    };

    _onPressSend = () => {
        let APIConfirmationType = this.props.navigation.getParam("confirmationType", "");
        if (APIConfirmationType === "") {
            CommonUtilities.showAlert("Something is wrong with response from previous screen", false);
        }

        if (this.state.counter > 0) {
            return;
        }

        var resendCodeParameters = {
            phone: this.state.selectedCountry.dialCode + this._phoneWithoutMask(this.state.phone),
            vendorId: constant.DeviceInfo.getUniqueID(),
            type: APIConfirmationType,
        };

        this.props.onVerifyPhone(resendCodeParameters);
    };

    _renderPopoverContent = () => (
        <View style={styles.popupContent}>
            <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => this._closePopover(constant.countryDetails.SA)}
            >
                {constant.countryDetails.SA.image}
                <Text style={{ marginLeft: 5, marginTop: 15 }}>
                    {constant.countryDetails.SA.name + " " + "(" + constant.countryDetails.SA.dialCode + ")"}
                </Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: "gray", height: 1, width: 170, marginLeft: 0, marginTop: 15 }} />
            <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => this._closePopover(constant.countryDetails.IN)}
            >
                {constant.countryDetails.IN.image}
                <Text style={{ marginLeft: 5, marginTop: 15 }}>
                    {constant.countryDetails.IN.name + " " + "(" + constant.countryDetails.IN.dialCode + ")"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    render() {
        let btnBGColor = this.state.counter > 0 ? constant.buttonDisableColor : constant.themeColor;
        return (
            // Main View (Container)
            <PopoverContainer padding={5}>
                <View style={styles.container}>
                    <Spinner
                        visible={this.props.verifyPhoneState.isLoading}
                        cancelable={true}
                        textStyle={{ color: "#FFF" }}
                    />
                    <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                        <View style={{ width: "80%", marginTop: 30 }}>
                            <Text> {baseLocal.t("Enter your phone number")} </Text>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                                <TouchableOpacity
                                    ref="btnCountry"
                                    style={{ alignSelf: "center", marginTop: 5 }}
                                    onPress={this._showPopover}
                                >
                                    <Popover
                                        placement={popoverPlacement}
                                        isVisible={this.state.isPopoverVisible}
                                        component={this._renderPopoverContent}
                                    >
                                        {this.state.selectedCountry.image}
                                    </Popover>
                                </TouchableOpacity>

                                <View style={{ width: "80%", marginLeft: 10 }}>
                                    <AppTextField
                                        reference={this.phoneRef}
                                        label={baseLocal.t("Phone No")}
                                        value={this.state.phone}
                                        textColor={constant.themeColor}
                                        baseColor={constant.themeColor}
                                        tintColor={constant.themeColor}
                                        maxLength={11}
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        selectTextOnFocus={false}
                                        onChangeText={this._onChangePhone}
                                    />
                                </View>
                            </View>
                            <ThemeButton
                                backgroundColor={btnBGColor}
                                title={baseLocal.t("Send Confirmation Code") + this._counterValue()}
                                onPress={this._onPressSend}
                            />
                            {this.state.isCodeSectionVisible === true ? (
                                <View style={{ width: "100%", marginTop: 20 }}>
                                    <View style={{ width: "70%", flexDirection: "row", justifyContent: "flex-start" }}>
                                        <Text style={styles.callMeNoteText}> {baseLocal.t(callMeNote)} </Text>
                                        <ThemeButton
                                            backgroundColor={btnBGColor}
                                            title={baseLocal.t("CALL ME")}
                                            onPress={this._onPressCallMe}
                                            width="40%"
                                        />
                                    </View>
                                    <Text style={{ marginTop: 20 }}> {baseLocal.t("Enter confirmation code")} </Text>
                                    <View style={{ width: "80%", marginLeft: 10 }}>
                                        <AppTextField
                                            reference={this.codeRef}
                                            label={baseLocal.t("Confirmation code")}
                                            value={this.state.code}
                                            textColor={constant.themeColor}
                                            baseColor={constant.themeColor}
                                            tintColor={constant.themeColor}
                                            maxLength={11}
                                            returnKeyType="done"
                                            keyboardType="numeric"
                                            selectTextOnFocus={false}
                                            onChangeText={this._onChangeCode}
                                        />
                                    </View>
                                    <ThemeButton title={baseLocal.t("SUBMIT")} onPress={this._onPressSubmit} />
                                </View>
                            ) : null}
                        </View>
                    </ScrollView>
                </View>
            </PopoverContainer>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        verifyPhoneState: state.verifyCode,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onVerifyPhone: parameters =>
            dispatch({
                type: constant.actions.verifyPhoneRequest,
                payload: { endPoint: constant.APIRequestVerifyPhones, parameters: parameters },
            }),
        onVerifyCode: parameters =>
            dispatch({
                type: constant.actions.verifyCodeRequest,
                payload: { endPoint: constant.APIVerifyPhoneCode, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VerifyPhoneScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
    popupContent: {
        width: 200,
        height: 120,
        padding: 10,
        paddingLeft: 15,
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: "black",
        backgroundColor: "white",
    },
    callMeNoteText: {
        fontFamily: constant.themeFont,
        fontSize: 14,
        textAlign: "justify",
        marginRight: 5,
        color: constant.themeColor,
    },
});
