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

// Common Utilities
import utilities, {setInitialGlobalValues} from './src/Helper/CommonUtilities'

export default class App extends Component {
    constructor(props) {
        super(props);

        // Set Statusbar Light Content for iOS
        StatusBar.setBarStyle("light-content", true);
        
        // Global Variables (App wise scope)
        setInitialGlobalValues()

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
            try {
                AsyncStorage.setItem(isLogin, 'true');
              } catch (error) {
                // Error saving data
              }
        })
    }

    // Life Cycle
    componentWillMount() {
        AsyncStorage.getItem(Constants.isLogin).then(value => {
            if (value === "true") {
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

        // return (
        //     <Provider store={store}>
        //         <Router onPressLogout={this.onLogout} />
        //     </Provider>
        // );
    }
}
