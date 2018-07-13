/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, FlatList } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization
import AppTextField from "../../../Components/AppTextField"; // Custom Text Field
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager

var lastProductId = 0;
class SuggestProductScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);
        this.state = {
            arrProducts: [],
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Suggest a Product"), true);

    componentDidMount = () => {};

    componentWillReceiveProps = newProps => {
        if (newProps.isSuccess === true) {
        }
    };

    _onSubmitText = text => {

    }

    _onBlurText = () => {

    }

    _renderProductList = () => {
        return (
            <FlatList
                style={{
                    width: "95%",
                }}
                data={this.state.arrProducts}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this._renderListItem}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled
            />
        );
    };

    _renderListItem = item => {
        return (
            <View style={{flexDirection:"row"}}>
                {/* // Email Text Field */}
                <AppTextField
                    reference={`txtProduct${item.id}`}
                    label={baseLocal.t("Product Name / Description")}
                    value={item.value}
                    textColor={constant.themeColor}
                    baseColor={constant.themeColor}
                    tintColor={constant.themeColor}
                    returnKeyType="return"
                    onSubmitEditing={this._onSubmitText}
                    onBlur={this._onBlurText}
                />
            </View>
        );
    };

    render = () => {
        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} />
                {this._renderProductList()}
            </View>
        );
    };
}

mapStateToProps = (state, props) => {
    return {
        isLoading: state.suggestProduct.isLoading,
        isSuccess: state.suggestProduct.isSuccess,
    };
};

mapDispatchToProps = dispatch => {
    return {
        onLogin: parameters =>
            dispatch({
                type: constant.actions.suggestProductRequest,
                payload: { endPoint: constant.APISuggestProduct, parameters: parameters },
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SuggestProductScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
});
