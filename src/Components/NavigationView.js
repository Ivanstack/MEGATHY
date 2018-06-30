import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import * as constant from "../Helper/Constants"

export default class componentName extends Component {
    render() {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            if (this.props.navigation.state.params != undefined && this.props.navigation.state.params.category != undefined) {
                                this.props.navigation.goBack();
                            } else {
                                this.props.navigation.navigate("DrawerToggle");
                            }
                        }}
                    >
                        <Icon
                            name={
                                this.props.navigation.state.params != undefined && this.props.navigation.state.params.category != undefined
                                    ? "arrow-left"
                                    : "navicon"
                            }
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}> {this.props.title} </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        color: "white",
        margin: 4,
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: constant.themeFont,
    },
});
