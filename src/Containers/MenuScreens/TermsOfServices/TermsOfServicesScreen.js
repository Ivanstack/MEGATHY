/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { View, WebView, TouchableOpacity, Text } from "react-native";
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization

import * as constant from "../../../Helper/Constants";

//Common Styles
import CommonStyle from "../../../Helper/CommonStyle"

//Lib
import Icon from "react-native-vector-icons/EvilIcons";

class TermsOfServicesScreen extends Component {
    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", width: "100%"}}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            if (navigation.state.params != undefined && navigation.state.params.category != undefined) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("DrawerToggle");
                            }
                        }}
                    >
                        <Icon
                            name={
                                navigation.state.params != undefined && navigation.state.params.category != undefined
                                    ? "arrow-left"
                                    : "navicon"
                            }
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={CommonStyle.headerText}>{baseLocal.t("Terms of Services")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });
   
    render() {
        return (
            // Main View (Container)
            <View style={{ flex: 1, padding:8, backgroundColor:"white" }}>
                <WebView source={require("../../../Resources/HTML/TermsAndConditions.html")} scalesPageToFit={false} />
            </View>
        );
    }
}

export default TermsOfServicesScreen;
