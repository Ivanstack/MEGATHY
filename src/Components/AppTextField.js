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
                    value={this.props.value === undefined ? "" : this.props.value}
                    maxLength={this.props.maxLength === undefined ? 255 : this.props.maxLength}
                    editable={this.props.editable === undefined ? true : this.props.editable}
                    selectTextOnFocus={this.props.selectTextOnFocus === undefined ? true : this.props.selectTextOnFocus}
                    textColor={this.props.textColor === undefined ? "white" : this.props.textColor}
                    baseColor={this.props.baseColor === undefined ? "white" : this.props.baseColor}
                    tintColor={this.props.tintColor === undefined ? "white" : this.props.tintColor}
                    returnKeyType={this.props.returnKeyType === undefined ? "next" : this.props.returnKeyType}
                    keyboardType={this.props.keyboardType === undefined ? "default" : this.props.keyboardType}
                    autoFocus={this.props.autoFocus === undefined ? false : this.props.autoFocus}
                    autoCapitalize={this.props.autoCapitalize === undefined ? "none" : this.props.autoCapitalize}
                    autoCorrect={this.props.autoCorrect === undefined ? false : this.props.autoCorrect}
                    multiline={this.props.multiline === undefined ? false : this.props.multiline}
                    clearTextOnFocus={this.props.clearTextOnFocus === undefined ? false : this.props.clearTextOnFocus}
                    secureTextEntry={this.props.secureTextEntry === undefined ? false : this.props.secureTextEntry}
                    enablesReturnKeyAutomatically={
                        this.props.enablesReturnKeyAutomatically === undefined
                            ? true
                            : this.props.enablesReturnKeyAutomatically
                    }
                    onChangeText={this.props.onChangeText}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    onPress={this.props.onPress}
                    onSubmitEditing={this.props.onSubmitEditing}
                />
            </View>
        );
    }
}
