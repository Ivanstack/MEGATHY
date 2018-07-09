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
import PostLoginRouter from "./src/Router/PostLoginRouter";

// Constant
import * as Constants from "./src/Helper/Constants";

// Common Utilities
import * as CommonUtilities from "./src/Helper/CommonUtilities";

export default class App extends Component {
    constructor(props) {
        super(props);

        // Set Statusbar Light Content for iOS
        StatusBar.setBarStyle("light-content", true);

        // Global Variables (App wise scope)
        CommonUtilities.setInitialGlobalValues();

        // States
        this.state = {
            isLogin: null,
            isStoreSet: false,
        };

        context = this;
        Constants.emitter.addListener(Constants.logoutListener, () => {
            context.setState({ isLogin: false, isStoreSet: false });
        });

        Constants.emitter.addListener(Constants.loginListener, () => {
            context.setState({ isLogin: true });
        });

        Constants.emitter.addListener(Constants.setStoreListener, () => {
            context.setState({ isStoreSet: true });
        });
    }

    // Life Cycle
    componentWillMount() {
        setTimeout(() => {
            if (global.currentUser === null) {
                this.setState({
                    isLogin: false,
                    isStoreSet: false,
                });
            } else if (global.currentStore === null) {
                this.setState({
                    isLogin: true,
                    isStoreSet: false,
                });
            } else {
                this.setState({
                    isLogin: true,
                    isStoreSet: true,
                });
            }
        }, 400); // Time to display Splash Screen
    }

    render() {
        if (this.state.isLogin == null) {
            return (
                <View />
            )
        }
        else if (this.state.isStoreSet) {
            return (
                <Provider store={store}>
                    <Router />
                    {/* <Router onPressLogout={this.onLogout} /> */}
                </Provider>
            );
        } else if (this.state.isLogin) {
            return (
                <Provider store={store}>
                    <PostLoginRouter />
                    {/* <LoginRouter onPressLogin={this.onLogin} /> */}
                </Provider>
            );
        } else {
            return (
                <Provider store={store}>
                    <LoginRouter />
                    {/* <LoginRouter onPressLogin={this.onLogin} /> */}
                </Provider>
            );
        }
    }
}
