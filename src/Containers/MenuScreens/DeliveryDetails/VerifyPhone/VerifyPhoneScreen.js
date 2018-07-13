/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager
import AppTextField from "../../../../Components/AppTextField"; // Custom Text Field

class VerifyPhoneScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.phoneRef = this._updateRef("phone");
        this.state = {
            phone: "",
            selectedCountry: constant.countyDetails.SA,
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Location"), true);

    componentDidMount() {}

    componentWillReceiveProps(newProps) {}

    _onChangePhone = text => {
        constant.debugLog(text);

        var maskedPhone = "";
        if (this.state.selectedCountry.code === "IN") {
            var x = text.replace(/\D/g, "").match(/(\d{0,5})(\d{0,5})/);
            maskedPhone = x[1] + " " + x[2];
        } else {
            var x = text.replace(/\D/g, "").match(/(\d{0,2})(\d{0,3})(\d{0,4})/);
            maskedPhone = x[1] + " " + x[2] + " " + x[3];
        }
        this.setState({
            phone: maskedPhone,
        });
    };

    _onSubmitPhone = () => {
        let newCountryState = null;
        if (this.state.selectedCountry.code === "IN") {
            newCountryState = constant.countyDetails.SA;
        } else {
            newCountryState = constant.countyDetails.IN;
        }

        this.setState({
            selectedCountry: newCountryState,
        }, () => {
            this._onChangePhone(this._phoneWithoutMask(this.state.phone))
        });
    };

    _phoneWithoutMask = (text) => {
        return String(text).replace(" ", "");
    };

    _updateRef = (name, ref) => {
        this[name] = ref;
    };

    render() {
        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner
                    visible={this.props.isLoading}
                    cancelable={true}
                    textStyle={{ color: "#FFF" }}
                />
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                    <View style={{ width: "80%", marginTop: 50 }}>
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
                            onChangeText={this._onChangePhone}
                        />

                        <TouchableOpacity onPress={this._onSubmitPhone}>
                            <Text> Change Format</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
});
