/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization
import AppTextField from "../../../Components/AppTextField"; // Custom Text Field
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager

//Common Styles
import CommonStyle from "../../../Helper/CommonStyle"

//Lib
import Icon from "react-native-vector-icons/EvilIcons";

class ContactUsScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);

        this.emailRef = this._updateRef.bind(this, "email");
        this.commentRef = this._updateRef.bind(this, "comment");

        this.state = {
            email: "",
            comment: "",
        };
    }

    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", width: "100%"}}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            if (navigation.state.params != undefined && navigation.state.params.category != undefined) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("DrawerToggle");
                            }
                        }}
                    >
                        <Icon
                            name={
                                navigation.state.params != undefined && navigation.state.params.category != undefined
                                    ? "arrow-left"
                                    : "navicon"
                            }
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={CommonStyle.headerText}>{baseLocal.t("Contact us")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });
    componentDidMount() {}

    componentWillReceiveProps(newProps) {
        if (newProps.isSuccess === true) {
            this.setState({
                email: "",
                comment: "",
            });
        }
    }

    _onChangeText = text => {
        ["email", "comment"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                this.setState({ [name]: text });
            }
        });
    };

    _onSubmitEmail = () => {
        this.comment.focus();
    };

    _onSubmitComment = () => {
        this._onPressSend();
    };

    _onPressSend = () => {
        if (!CommonUtilities.validateEmail(this.state.email)) {
            CommonUtilities.showAlert("Invalid email id");
            return;
        }

        if (this.state.comment.trim() === "") {
            CommonUtilities.showAlert("Comment cannot be blank");
            return;
        }

        let contactUsParameters = {
            email: this.state.email,
            description: this.state.comment,
        };
        this.props.contactUs(contactUsParameters);
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
                    // textContent={"Please wait..."}
                    textStyle={{ color: "#FFF" }}
                />
                {/* <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}> */}
                <View style={{ width: "80%" }}>
                    {/* // Email Text Field */}
                    <AppTextField
                        reference={this.emailRef}
                        label={baseLocal.t("Email Id")}
                        value={this.state.email}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        returnKeyType="next"
                        keyboardType="email-address"
                        onSubmitEditing={this._onSubmitEmail}
                        onChangeText={this._onChangeText}
                    />
                    {/* // Password Text Field */}
                    <AppTextField
                        reference={this.commentRef}
                        label={baseLocal.t("How can we help you")}
                        value={this.state.comment}
                        textColor={constant.themeColor}
                        baseColor={constant.themeColor}
                        tintColor={constant.themeColor}
                        returnKeyType="done"
                        onSubmitEditing={this._onSubmitComment}
                        onChangeText={this._onChangeText}
                    />
                </View>
                {/* // Add Location Button */}
                <TouchableOpacity style={styles.loginButtonStyle} onPress={this._onPressSend}>
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "Ebrima",
                            fontWeight: "bold",
                        }}
                    >
                        {baseLocal.t("Send")}
                    </Text>
                </TouchableOpacity>
                {/* </ScrollView> */}
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.contactUs.isLoading,
        isSuccess: state.contactUs.isSuccess,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        contactUs: parameters =>
            dispatch({
                type: constant.actions.contactUsRequest,
                payload: { endPoint: constant.APIContactUs, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactUsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        height: Dimensions.get("window").height,
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
});
