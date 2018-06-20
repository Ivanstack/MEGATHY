import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { StackNavigator } from "react-navigation";

import LoginScreen from "../Containers/LoginScreens/LoginScreen";
import SignUpScreen from "../Containers/LoginScreens/SignUpScreen";
import ForgotPasswordScreen from "../Containers/LoginScreens/ForgotPasswordScreen";
import VerifyCodeScreen from "../Containers/LoginScreens/VerifyCodeScreen"
import ResetPasswordScreen from "../Containers/LoginScreens/ResetPasswordScreen"
import CityScreen from "../Containers/PostLoginScreens/CityScreen";
import AreaScreen from "../Containers/PostLoginScreens/AreaScreen";
import StoreScreen from "../Containers/PostLoginScreens/StoreScreen";

// Main Navigation Flow
const LoginNav = StackNavigator(
    {
        LoginScreen: { screen: LoginScreen },
        SignUpScreen: { screen: SignUpScreen },
        ForgotPasswordScreen: { screen: ForgotPasswordScreen },
        VerifyCodeScreen: { screen: VerifyCodeScreen },
        ResetPasswordScreen: {screen: ResetPasswordScreen},
        CityScreen: { screen: CityScreen },
        AreaScreen: { screen: AreaScreen },
        StoreScreen: { screen: StoreScreen},
    },
    {
        headerMode: "none",
        navigationOptions: {
            headerVisible: false,
        },
    }
);

// Navigation Option
// LoginNav.navigationOptions = {
//     header: null,
//     gesturesEnabled: false,
// };

export default LoginNav;
