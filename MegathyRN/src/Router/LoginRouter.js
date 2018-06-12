import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { StackNavigator } from "react-navigation";

import LoginScr from "../container/LoginScr";
import SignUp from "../container/SignUp";
import ForgotPassword from "../container/ForgotPassword";

// Main Navigation Flow
const LoginNav = StackNavigator(
    {
        LoginScr: { screen: LoginScr },
        SignUp: { screen: SignUp },
        ForgotPassword: {screen: ForgotPassword},
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
