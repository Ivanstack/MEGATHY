import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as constant from "../Helper/Constants"; // Constants

export default class ThemeButton extends Component {
    _onPress = () => {
        this.props.onPress();
    };

    render() {
        let bgColor = this.props.backgroundColor === undefined ? constant.themeColor : this.props.backgroundColor;
        let buttonWidth = this.props.width === undefined ? "100%" : this.props.width;
        return (
            <TouchableOpacity
                style={[styles.button, { backgroundColor: bgColor, width: buttonWidth }]}
                onPress={this._onPress}
            >
                <Text style={styles.buttonText}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontFamily: "Ebrima",
        fontWeight: "bold",
    },
});
