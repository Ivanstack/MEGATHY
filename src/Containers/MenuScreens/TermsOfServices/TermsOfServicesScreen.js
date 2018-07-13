/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { View, WebView } from "react-native";
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization

class TermsOfServicesScreen extends Component {
    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Terms of Services"), false);
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
