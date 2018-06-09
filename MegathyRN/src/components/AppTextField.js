/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { View } from "react-native";
import { TextField } from "react-native-material-textfield";

export default class AppTextField extends Component {
    render() {
        return (
            <View>
                <TextField
                    ref={this.props.reference === undefined ? "" : this.props.reference}
                    label={this.props.label === undefined ? "" : this.props.label}
                    textColor={this.props.textColor === undefined ? "white" : this.props.textColor}
                    baseColor={this.props.baseColor === undefined ? "white" : this.props.baseColor}
                    tintColor={this.props.tintColor === undefined ? "white" : this.props.tintColor}
                    returnKeyType={this.props.returnKeyType === undefined ? "" : this.props.returnKeyType}
                    keyboardType={this.props.keyboardType === undefined ? "default" : this.props.keyboardType}
                    autoCapitalize={this.props.autoCapitalize === undefined ? "none" : this.props.autoCapitalize}
                    autoCorrect={this.props.autoCorrect === undefined ? false : this.props.autoCorrect}
                    clearTextOnFocus={this.props.clearTextOnFocus === undefined ? false : this.props.clearTextOnFocus}
                    secureTextEntry={this.props.secureTextEntry === undefined ? false : this.props.secureTextEntry}
                    enablesReturnKeyAutomatically={this.props.enablesReturnKeyAutomatically === undefined ? true : this.props.enablesReturnKeyAutomatically}
                />
            </View>
        );
    }
}
