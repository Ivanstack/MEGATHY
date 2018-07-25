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
import Icon from "react-native-vector-icons/EvilIcons";

import SegmentControl from "../../../../Components/SegmentControl";

// Components Styles
import UserProfileStyles from "./UserProfileStyles";

// Class Variable

class UserProfileScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            index: 0,
        };
    }

    // static navigationOptions = CommonUtilities.navigationView(baseLocal.t("User Profile"), false);

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            navigation.navigate("DrawerToggle");
                        }}
                    >
                        <Icon name={"navicon"} style={{ marginLeft: 10 }} size={35} color="white" />
                    </TouchableOpacity>
                    <Text style={UserProfileStyles.headerText}>{baseLocal.t("User Profile")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });

    componentDidMount() {}

    _changeLanguage = index => {
        global.currentAppLanguage = index === 0 ? constant.languageArabic : constant.languageEnglish;
        // constant.debugLog("Change Language global :==> " + global.currentAppLanguage);
        AsyncStorage.setItem(constant.keyCurrentAppLanguage, global.currentAppLanguage).then(val => {
            setTimeout(() => {
                baseLocal.locale = global.currentAppLanguage;
                // this.props.navigation.setParams({ otherParam: "Updated!" });
                this.props.navigation.setParams({});
                this.setState({ index });
            }, 300);
        });
    };

    render() {
        return (
            // Main View (Container)
            <View style={UserProfileStyles.container}>
                <TouchableOpacity
                    style={{ marginTop: 30, height: 30 }}
                    onPress={() => this.props.navigation.navigate("EditUserProfileScreen")}
                >
                    <Text style={UserProfileStyles.btnTxtStyle}>{baseLocal.t("Edit User Profile")}</Text>
                </TouchableOpacity>
                {global.currentUser.facebookId === "" ? (
                    <TouchableOpacity
                        style={{ marginTop: 20, height: 30 }}
                        onPress={() => this.props.navigation.navigate("ChangePasswordScreen")}
                    >
                        <Text style={UserProfileStyles.btnTxtStyle}>{baseLocal.t("Change Password")}</Text>
                    </TouchableOpacity>
                ) : null}

                <Text style={{ fontFamily: constant.themeFont, fontSize: 15, fontWeight: "bold", marginTop: 25 }}>
                    Choose your preffered language
                </Text>
                <Text style={{ fontFamily: constant.themeFont, fontSize: 15, fontWeight: "bold", marginTop: 4 }}>
                    (اختار لغتك المفضلة:)
                </Text>

                <SegmentControl
                    style={{
                        height: 40,
                        width: Dimensions.get("window").width * 0.9,
                        marginTop: 25,
                    }}
                    values={["العربية", "English"]}
                    selectedIndex={global.currentAppLanguage === constant.languageArabic ? 0 : 1}
                    borderColor="lightgray"
                    borderRadius={5}
                    textColor="black"
                    viewWidth={Dimensions.get("window").width * 0.9}
                    onChange={item => this._changeLanguage(item.index)}
                />

                <Text
                    style={{ fontFamily: constant.themeFont, fontSize: 16, position: "absolute", bottom: 5, left: 10 }}
                >
                    {baseLocal.t("App Version: ")}
                    {constant.DeviceInfo.getVersion() === undefined ? "0.0" : constant.DeviceInfo.getVersion()}
                </Text>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        // isLoading: state.login.isLoading,
        // isSuccess: state.login.isSuccess,
        // result: state.login.result,
        // error: state.login.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // onLogin: parameters =>
        //     dispatch({
        //         type: constant.actions.loginRequest,
        //         payload: { endPoint: constant.APILogin, parameters: parameters },
        //     }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileScreen);
