/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AsyncStorage } from "react-native";

import AppMain from "./src/container/AppMain";

// Redux
import { Provider, connect } from "react-redux";
import store from "./src/AppRedux/Reducers/index";

// Navigation
import Router from "./src/Router/Router";
import LoginScr from "./src/container/LoginScr";

// Constant
import Constants from "./src/Helper/constant";

export default class App extends Component {
    constructor(props) {
        super(props);

        global.loginKey = "abc";
        global.currentUser = null;
        global.currentAppLanguage = "en";
        this.state = {
            isLogin: false,
        };

        context = this;
        Constants.emitter.addListener(Constants.LOGOUT_EVENT, function(x) {
            console.log("Logout: " + x);
            context.setState({ isLogin: false });
        });
    }

    // Life Cycle
    componentWillMount() {
        AsyncStorage.getItem(Constants.LOGIN_STATUS).then(value => {
            if (value === true) {
                this.setState({
                    isLogin: true,
                });
            } else {
                this.setState({
                    isLogin: false,
                });
            }
        });
    }

    onLogin = () => {
        this.setState({
            isLogin: true,
        });
    };

    onLogout = () => {
        this.setState({
            isLogin: false,
        });
    };

    render() {
        if (this.state.isLogin) {
            return (
                <Provider store={store}>
                    <Router onPressLogout={this.onLogout} />
                </Provider>
            );
        } else {
            return (
                <Provider store={store}>
                    <LoginScr onPressLogin={this.onLogin} />
                </Provider>
            );
        }
    }
}
