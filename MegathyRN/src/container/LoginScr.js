/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    AsyncStorage,
    StatusBar,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity,
    Alert,
} from "react-native";
import AppTextField from "../components/AppTextField";

import constant from "../Helper/constant";

// Navigation
import { NavigationActions } from "react-navigation";
import Router from "../Router/Router";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../AppRedux/Actions/actions";

// Network Utility
import sharedNetworkUtility from "../Helper/NetworkUtility";

import KeyboardManager from "react-native-keyboard-manager";

class LoginScr extends Component {
    constructor(props) {
        super(props);
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(true);

        // this.onPressLogin = this.onPressLogin.bind(this)
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);

        this.emailRef = this.updateRef.bind(this, "email");
        this.passwordRef = this.updateRef.bind(this, "password");

        this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

        this.state = {
            secureTextEntry: true,
            email: "",
            password: "",
        };
    }

    static navigationOptions = navigation => {
        header: null;
    };

    componentDidUpdate() {
        console.log("Login Status : ", this.props.login);
        AsyncStorage.setItem(constant.LOGIN_STATUS, "true");
    }

    onPressLogin() {
        
    }

    onFocus() {
        let { errors = {} } = this.state;
        for (let name in errors) {
            let ref = this[name];
            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }
        this.setState({ errors });
    }

    onChangeText(text) {
        ["email", "password"].map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
            if (ref.isFocused()) {
                console.log("State Key: " + [name]);
                this.setState({ [name]: text });
            }
        });
    }

    onSubmitEmail() {
        this.password.focus();
    }

    onSubmitPassword() {
        this.password.blur();
    }

    onAccessoryPress() {
        this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
    }

    renderPasswordAccessory() {
        let { secureTextEntry } = this.state;
        let name = secureTextEntry ? "visibility" : "visibility-off";
        return (
            <MaterialIcon
                size={24}
                name={name}
                color={TextField.defaultProps.baseColor}
                onPress={this.onAccessoryPress}
                suppressHighlighting
            />
        );
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { errors = {}, secureTextEntry, email, password } = this.state;

        StatusBar.setBarStyle("light-content", true);
        return (
            // Main View (Container)
            <View style={styles.container}>
                {/* // Top Image */}
                <Image style={{ width: 189, height: 59 }} source={require("../Resources/Images/LogoTitleImage.png")} />

                {/* // FB Button */}
                <TouchableOpacity
                    style={{ width: "82%", height: 40, marginTop: 25 }}
                    onPress={() => {
                        alert("FB button tapped");
                    }}
                >
                    <View style={styles.fbButtonStyle}>
                        <Image
                            style={{ width: 15, height: 15, marginRight: 15 }}
                            source={require("../Resources/Images/FBIcon.png")}
                        />
                        <Text style={{ color: "#405798", fontFamily: "Ebrima", fontWeight: "bold" }}>
                            Login with facebook{" "}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* // OR seperator */}
                <View style={{ flexDirection: "row", width: "80%", height: 20, marginTop: 20 }}>
                    <View
                        style={{
                            width: "40%",
                            height: 1,
                            backgroundColor: "#EAEAEA",
                            marginTop: 10,
                            marginRight: "5%",
                        }}
                    >
                        {" "}
                    </View>
                    <View
                        style={{
                            backgroundColor: "#EAEAEA",
                            marginRight: "5%",
                            height: 26,
                            width: 28,
                            borderRadius: 13,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#CF2526", fontFamily: "Ebrima", fontSize: 10 }}> OR </Text>
                    </View>
                    <View style={{ width: "40%", height: 1, backgroundColor: "#EAEAEA", marginTop: 10 }}> </View>
                </View>

                <View style={{ width: "80%" }}>
                    {/* // Email Text Field */}
                    <AppTextField
                        reference={this.emailRef}
                        label="Email Id"
                        returnKeyType="next"
                        keyboardType="email-address"
                        onSubmitEditing={this.onSubmitEmail}
                        onChangeText={this.onChangeText}
                        onFocus={this.onFocus}
                    />

                    {/* // Password Text Field */}
                    <AppTextField
                        reference={this.passwordRef}
                        label="Password"
                        returnKeyType="done"
                        clearTextOnFocus={true}
                        secureTextEntry={secureTextEntry}
                        onSubmitEditing={this.onSubmitPassword}
                        onChangeText={this.onChangeText}
                        onFocus={this.onFocus}
                    />
                </View>

                {/* // Login Button */}
                <TouchableOpacity style={styles.loginButtonStyle} onPress={this.onPressLogin}>
                    <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>Login</Text>
                </TouchableOpacity>

                {/* // Forgot Password and Signup Buttons View */}
                <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                    {/* // Forgot Password Button */}
                    <TouchableOpacity
                        onPress={() => {
                            alert("Forgot Password button tapped");
                        }}
                    >
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 15 }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* // Signup Button */}
                    <TouchableOpacity
                        onPress={() => {
                            alert("Sign Up button tapped");
                        }}
                    >
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 15 }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                {/* // Continue as guest user Button */}
                <TouchableOpacity
                    style={styles.loginButtonStyle}
                    onPress={() => {
                        alert("Continue as guest user");
                    }}
                >
                    <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                        Continue as guest user
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        login: state.dataReducer.login,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScr);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CF2526",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        justifyContent: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
    fbButtonStyle: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#EAEAEA",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    loginButtonStyle: {
        width: "82%",
        marginTop: 20,
        backgroundColor: "#99050D",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
});
