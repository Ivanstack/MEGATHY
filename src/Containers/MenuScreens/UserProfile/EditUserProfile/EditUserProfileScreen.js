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
import EditUserProfileStyle from "./EditUserProfileStyle";
import AppTextField from "../../../../Components/AppTextField"; // Custom Text Field
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager

//Common Styles
import CommonStyle from "../../../../Helper/CommonStyle"

//Lib
import Icon from "react-native-vector-icons/EvilIcons";

class EditUserProfileScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.fullNameRef = this._updateRef.bind(this, "fullName");
        this.contactNoRef = this._updateRef.bind(this, "contactNo");

        this.state = {
            fullName: global.currentUser ? global.currentUser.userName : "",
            contactNo: global.currentUser ? global.currentUser.phone : "",
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Update User Profile"), true);
    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            navigation.goBack();
                        }}
                    >
                        <Icon name={"arrow-left"} style={{ marginLeft: 10 }} size={35} color="white" />
                    </TouchableOpacity>
                    <Text style={CommonStyle.headerText}>{baseLocal.t("Update User Profile")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });
    componentDidMount() { }

    componentWillReceiveProps(newProps) {
        console.log("New Props =======> ",newProps);
     }

    // Misc Methods
    _onChangeText = (text, name) => {
        // ["fullName", "contactNo"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
        //     if (ref.isFocused()) {
        //         this.setState({ [name]: text });
        //     }
        // });

        if (name === "fullName") {
            this.setState({ fullName: text });
        } else {
            this.setState({ contactNo: text });
        }
    };

    _onSubmitFullName = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate("VerifyPhoneScreen");
    };

    // _onSubmitComment = () => {
    //     this._onPressSend();
    // };

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

    _onPressUpdate = () => {
        Keyboard.dismiss();
        if (this.state.fullName.trim() === "") {
            CommonUtilities.showAlert("Full Name cannot be blank");
            return;
        }
        if (this.state.contactNo.trim() === "") {
            CommonUtilities.showAlert("Phone cannot be blank");
            return;
        }
        this.props.onUpdateProfile();
    }

    render() {
        return (
            // Main View (Container)
            // Main View (Container)
            <View style={EditUserProfileStyle.container}>
                <Spinner
                    visible={this.props.isLoading}
                    cancelable={true}
                    // textContent={"Please wait..."}
                    textStyle={{ color: "#FFF" }}
                />
                <View style={{ width: "90%" }}>
                    {/* // Full Name Text Field */}
                    <AppTextField
                        reference={this.fullNameRef}
                        label={baseLocal.t("Full Name")}
                        value={this.state.fullName}
                        textColor={constant.themeColor}
                        baseColor={this.state.fullName.length > 0 ? constant.themeColor : constant.grayShadeColorAA}
                        tintColor={constant.themeColor}
                        returnKeyType="next"
                        onSubmitEditing={this._onSubmitFullName}
                        onChangeText={(text) => this._onChangeText(text, "fullName")}
                    />
                    {/* // Phone No. Text Field */}
                    <AppTextField
                        reference={this.contactNoRef}
                        label={baseLocal.t("Phone")}
                        value={this.state.contactNo}
                        textColor={constant.themeColor}
                        baseColor={this.state.contactNo.length > 0 ? constant.themeColor : constant.grayShadeColorAA}
                        tintColor={constant.themeColor}
                        returnKeyType="done"
                        // onSubmitEditing={this._onSubmitComment}
                        onChangeText={(text) => this._onChangeText(text, "phone")}
                        onFocus={this._onSubmitFullName}
                    />
                </View>
                {/* // Update Profile Button */}
                <TouchableOpacity style={EditUserProfileStyle.updateButtonStyle} onPress = {this._onPressUpdate()}>
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "Ebrima",
                            fontWeight: "bold",
                        }}
                    >
                        {baseLocal.t("Update")}
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
        onUpdateProfile: parameters =>
            dispatch({
                type: constant.actions.updateUserProfileRequest,
                payload: { endPoint: constant.APIUpdateProfile, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditUserProfileScreen);
