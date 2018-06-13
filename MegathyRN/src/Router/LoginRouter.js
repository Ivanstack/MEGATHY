import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { StackNavigator } from "react-navigation";

import LoginScreen from "../Containers/LoginScreens/LoginScreen";
import SignUpScreen from "../Containers/LoginScreens/SignUpScreen";
import ForgotPasswordScreen from "../Containers/LoginScreens/ForgotPasswordScreen";

// Main Navigation Flow
const LoginNav = StackNavigator(
    {
        LoginScreen: { screen: LoginScreen },
        SignUpScreen: { screen: SignUpScreen },
        ForgotPasswordScreen: {screen: ForgotPasswordScreen},
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
