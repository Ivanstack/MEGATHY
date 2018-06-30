/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList } from "react-native";

// Constants
import * as constant from "../../../../Helper/Constants";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// const imageRadioSelected = "../../../../Resources/Images/DeliveryDetails/RadioButtonSelectedRed";
// const imageRadio = "../../../../Resources/Images/DeliveryDetails/RadioButton";

export default class AddressListItem extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        if (this.props.parentEntryPoint != undefined) this.props.onPressItem(this.props.address);
    };

    _onPressEdit = () => {
        this.props.onPressEditItem(this.props.address);
    };

    _onPressDelete = () => {
        this.props.onPressDeleteItem(this.props.address);
    };

    _onPressDeliver = () => {
        this.props.onPressDeliverItem(this.props.address);
    };

    render() {
        let imageRadioSelected = "../../../../Resources/Images/DeliveryDetails/RadioButtonSelectedRed.png";
        let imageRadio = "../../../../Resources/Images/DeliveryDetails/RadioButton.png";
        return (
            // Main View (Container)
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={this._onPress.bind(this)}>
                <View style={styles.container}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {this.props.parentEntryPoint != undefined ? (
                            // {/* // Radio Button */}
                            <View style={{ width: "10%" }}>
                                {this.props.address.selected === undefined ? (
                                    // {/* // Radio Button Selected */}
                                    <Image style={{ width: 20, height: 20 }} source={require(imageRadio)} />
                                ) : (
                                    // {/* // Radio Button unselected */}
                                    <Image style={{ width: 20, height: 20 }} source={require(imageRadioSelected)} />
                                )}
                            </View>
                        ) : null}
                        {/* // Details View */}
                        <View style={{ width: "90%" }}>
                            {/* // Name */}
                            <Text style={{ fontFamily: "Ebrima", fontWeight: "bold", fontSize: 14 }}>
                                {this.props.address.name}
                            </Text>
                            {/* // Address */}
                            <Text style={{ fontFamily: "Ebrima", fontSize: 14, marginTop: 5 }}>
                                {this.props.address.address}
                            </Text>
                            {/* // Mobile Number */}
                            <Text style={{ fontFamily: "Ebrima", fontSize: 14, marginTop: 5 }}>
                                {this.props.address.phone}
                            </Text>
                        </View>
                    </View>
                    {this.props.address.selected != undefined ? (
                        // {/* // Deliver to this address, Edit and Delete Buttons View */}
                        <View
                            style={{
                                width: "100%",
                                flexDirection: "column",
                                marginTop: 10,
                            }}
                        >
                            {this.props.parentEntryPoint != undefined ? (
                                // {/* // Deliver to this address Button */}
                                <TouchableOpacity
                                    style={[styles.signUpButtonStyle, { width: "100%" }]}
                                    onPress={this._onPressDeliver}
                                >
                                    <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                        {baseLocal.t("Deliver to this address")}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}

                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                {/* // Back Button */}
                                <TouchableOpacity style={styles.signUpButtonStyle} onPress={this._onPressEdit}>
                                    <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                        {baseLocal.t("Edit")}
                                    </Text>
                                </TouchableOpacity>

                                {/* // Sign Up Button */}
                                <TouchableOpacity style={styles.signUpButtonStyle} onPress={this._onPressDelete}>
                                    <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                                        {baseLocal.t("Delete")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        padding: 16,
        paddingBottom: 8,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "white",
    },
    signUpButtonStyle: {
        width: "48%",
        marginTop: 10,
        backgroundColor: constant.themeColor,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
});
