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
    Keyboard,
} from "react-native";

import AppTextField from "../../../../Components/AppTextField";

// Redux
import { connect } from "react-redux";

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";
import * as constant from "../../../../Helper/Constants";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

class AddAddressScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this._onPressBack = this._onPressBack.bind(this);
        this._onPressSave = this._onPressSave.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onChangeText = this._onChangeText.bind(this);

        this._onSubmitFullName = this._onSubmitFullName.bind(this);
        this._onSubmitPhone = this._onSubmitPhone.bind(this);
        this._onSubmitNotes = this._onSubmitNotes.bind(this);
        this._onFocusAddress = this._onFocusAddress.bind(this);

        this.fullNameRef = this._updateRef.bind(this, "fullName");
        this.phoneRef = this._updateRef.bind(this, "phone");
        this.addressRef = this._updateRef.bind(this, "address");
        this.notesRef = this._updateRef.bind(this, "notes");

        this.state = {
            secureTextEntry: true,
            fullName: global.currentUser.userName,
            phone: global.currentUser.phone,
            address: "",
            notes: "",
            visible: false,
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Location"), true);

    componentDidMount() {
        let selectedAddressTemp = this.props.navigation.getParam("selectedAddress", "");
        if (selectedAddressTemp != "") {
            this.setState({
                fullName: selectedAddressTemp.name,
                phone: selectedAddressTemp.phone,
                address: selectedAddressTemp.address,
                notes: selectedAddressTemp.note,
            });
        }
    }

    _onPressSave() {
        return;
        if (this.state.fullName.trim() === "") {
            CommonUtilities.showAlert("Full Name cannot be blank");
            return;
        }

        if (this.state.phone === "") {
            CommonUtilities.showAlert("Please register phone number first");
            return;
        }

        if (this.state.address === "") {
            CommonUtilities.showAlert("Password cannot be blank");
            return;
        }

        // var registerParameters = {
        //     userName: this.state.fullName,
        //     email: this.state.email,
        //     phone: this.state.email,
        //     deviceType: Platform.OS === "ios" ? constant.deviceTypeiPhone : constant.deviceTypeAndroid,
        //     notifyId: constant.notifyId,
        //     timeZone: constant.timeZone,
        //     vendorId: constant.DeviceInfo.getUniqueID(),
        //     appVersion: constant.DeviceInfo.getVersion() === undefined ? "0.0" : constant.DeviceInfo.getVersion(),
        // };

        // Show Loading View
        this.setState({ visible: true });

        networkUtility.postRequest(constant.APIRegister, registerParameters).then(
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
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        CommonUtilities.showAlert(error.data["message"], false);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
            }
        );
    }

    _onPressBack() {
        this.props.navigation.goBack();
    }

    _onFocus() {
        let { errors = {} } = this.state;
        for (let name in errors) {
            let ref = this[name];
            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }
        this.setState({ errors });
    }

    _onFocusAddress() {
        Keyboard.dismiss()
        constant.debugLog("Addres Pressed")
    }

    _onChangeText(text) {
        ["fullName", "phone", "address", "notes"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    }

    _onSubmitFullName() {
        // this.phone.focus();
    }

    _onSubmitPhone() {
        // this.password.focus();
    }

    _onSubmitNotes() {
        // this.confirmPassword.blur();
        // this.onPressSignUp();
    }

    _updateRef(name, ref) {
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
                    <View style={{ width: "80%" }}>
                        {/* // Full Name Text Field */}
                        <AppTextField
                            reference={this.fullNameRef}
                            label={baseLocal.t("Full Name")}
                            value={this.state.fullName}
                            textColor={constant.themeColor}
                            baseColor={constant.themeColor}
                            tintColor={constant.themeColor}
                            returnKeyType="next"
                            onSubmitEditing={this._onSubmitFullName}
                            onChangeText={this._onChangeText}
                            onFocus={this._onFocus}
                        />

                        {/* // Phone No Text Field */}
                        <AppTextField
                            reference={this.phoneRef}
                            label={baseLocal.t("Phone No")}
                            value={this.state.phone}
                            textColor={constant.themeColor}
                            baseColor={constant.themeColor}
                            tintColor={constant.themeColor}
                            returnKeyType="next"
                            keyboardType="numeric"
                            onSubmitEditing={this._onSubmitPhone}
                            onChangeText={this._onChangeText}
                            onFocus={this._onFocus}
                        />

                        {/* // Password Text Field */}
                        <AppTextField
                            reference={this.addressRef}
                            label={baseLocal.t("Press here to locate your address")}
                            value={this.state.address}
                            textColor={constant.themeColor}
                            baseColor={constant.themeColor}
                            tintColor={constant.themeColor}
                            returnKeyType="next"
                            // editable={false}
                            // onSubmitEditing={this._onSubmitAddress}
                            // onChangeText={this._onChangeText}
                            onFocus={this._onFocusAddress}
                            // onPress={this._onPressAddress}
                        />

                        {/* // Confirm Password Text Field */}
                        <AppTextField
                            reference={this.notesRef}
                            label={baseLocal.t("Location Notes")}
                            value={this.state.notes}
                            textColor={constant.themeColor}
                            baseColor={constant.themeColor}
                            tintColor={constant.themeColor}
                            returnKeyType="done"
                            onSubmitEditing={this._onSubmitNotes}
                            onChangeText={this._onChangeText}
                            onFocus={this._onFocus}
                            multiline={true}
                        />
                    </View>

                    {/* // Add Location Button */}
                    <TouchableOpacity
                        style={styles.loginButtonStyle}
                        onPress={() => {
                            alert("Add Location");
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "Ebrima",
                                fontWeight: "bold",
                            }}
                        >
                            {baseLocal.t("Add Location")}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        // login: state.dataReducer.login,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAddressScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
    },
    loginButtonStyle: {
        width: "82%",
        marginTop: 20,
        backgroundColor: constant.themeColor,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
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
        justifyContent: "flex-start",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
    headerText: {
        color: "white",
        margin: 4,
        // marginLeft: 5,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
});
