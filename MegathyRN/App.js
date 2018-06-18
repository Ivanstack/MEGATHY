/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AsyncStorage, StatusBar } from "react-native";

// Redux
import { Provider, connect } from "react-redux";
import store from "./src/AppRedux/Reducers/index";

// Navigation
import Router from "./src/Router/Router";
import LoginRouter from "./src/Router/LoginRouter";

// Constant
import Constants from "./src/Helper/Constants";

export default class App extends Component {
    constructor(props) {
        super(props);

        StatusBar.setBarStyle("light-content", true);
        
        // Global Variables (App wise scope)        
        global.loginKey = "";
        global.currentUser = null;
        global.currentAppLanguage = "en";

        // States
        this.state = {
            isLogin: false,
        };

        context = this;
        Constants.emitter.addListener(Constants.LOGOUT_EVENT, function(x) {
            Constants.debugLog("Logout: " + x);
            context.setState({ isLogin: false });
        });

        Constants.emitter.addListener(Constants.loginListener, () => {
            context.setState({isLogin: true});
        })
    }

    // Life Cycle
    componentWillMount() {
        AsyncStorage.getItem(Constants.isLogin).then(value => {
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
                    <LoginRouter onPressLogin={this.onLogin} />
                </Provider>
            );
        }
    }
}
