/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView, FlatList, Image } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization
import AppTextField from "../../../Components/AppTextField"; // Custom Text Field
import KeyboardManager from "react-native-keyboard-manager"; // IQKeyboard Manager
import Icon from "react-native-vector-icons/EvilIcons";

const textRefPrefix = "txtProduct";
var lastProductId = 0;
var defaultProducts = [];

class SuggestProductScreen extends Component {
    constructor(props) {
        super(props);

        this._setDefaultProducts();
        baseLocal.locale = global.currentAppLanguage;
        KeyboardManager.setShouldResignOnTouchOutside(false);
        KeyboardManager.setToolbarPreviousNextButtonEnable(false);
        this.arrTextFields = [];
        this.state = {
            arrProducts: defaultProducts,
        };
    }

    _setDefaultProducts = () => {
        lastProductId = 0;
        defaultProducts = []
        let ref = this._refForProductId(++lastProductId);
        this[`${ref}Ref`] = this._updateRef.bind(this, ref);
        defaultProducts.push({ id: lastProductId, value: "" });

        ref = this._refForProductId(++lastProductId);
        this[`${ref}Ref`] = this._updateRef.bind(this, ref);
        defaultProducts.push({ id: lastProductId, value: "" });

        ref = this._refForProductId(++lastProductId);
        this[`${ref}Ref`] = this._updateRef.bind(this, ref);
        defaultProducts.push({ id: lastProductId, value: "" });
    };

    componentDidMount = () => {
        this.setState({ arrProducts: defaultProducts });
    };

    componentWillReceiveProps = newProps => {
        if (newProps.isSuccess === true) {
            this._setDefaultProducts();
            this.setState({ arrProducts: defaultProducts });
        }
    };

    _onChangeText = (text,reference) => {
        // this.arrTextFields.map(name => ({ name, ref: this[name] })).forEach(({ name, ref }) => {
        //     if (ref.isFocused()) {
        //         var updatedProducrts = this.state.arrProducts;
        //         updatedProducrts.map((product, index) => {
        //             if (product.id == name.split(textRefPrefix)[1]) {
        //                 product.value = text;
        //             }
        //         });
        //         this.setState({
        //             arrProducts: updatedProducrts,
        //         });
        //     }
        // });

        var updatedProducrts = this.state.arrProducts;
        updatedProducrts.map((product, index) => {
          if (product.id == reference.split(textRefPrefix)[1]) {
            product.value = text;
          }
        });
        this.setState({ arrProducts: updatedProducrts });
    };

    _refForProductId = id => {
        return textRefPrefix + id.toString();
    };

    _onPressAddProduct = () => {
        let ref = this._refForProductId(++lastProductId);
        this[`${ref}Ref`] = this._updateRef.bind(this, ref);
        const updatedProducrts = [...this.state.arrProducts, ...[{ id: lastProductId, value: "" }]];
        this.setState({
            arrProducts: updatedProducrts,
        });
    };

    _onPressRemoveProduct = product => {
        if (this.state.arrProducts.length === 1) {
            return;
        }
        this.setState({
            arrProducts: this.state.arrProducts.filter(value => value !== product),
        });
    };

    _onPressSend = () => {
        var products = "";
        this.state.arrProducts.map(value => (products += value.value.trim().length > 0 ? value.value.trim() + "," : ""));
        if (products.length > 0) {
            products = products.slice(0, -1);
        } else {
            CommonUtilities.showAlert("Please enter at least one product name/description");
            return;
        }

        let suggestProductParameters = {
            vendorId: constant.DeviceInfo.getUniqueID(),
            product: products,
        };

        this.props.suggestProduct(suggestProductParameters);
    };

    _renderCustomNavigationView = () => {
        return (
            // Platform.OS === "ios"
            <View style={styles.navigationView}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate("DrawerToggle");
                        }}
                    >
                        <Icon name={"navicon"} style={{ marginLeft: 10, marginTop: 10 }} size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.navigationButtonText}> {baseLocal.t("Suggest a Product")} </Text>
                </View>
                <TouchableOpacity style={{ marginTop: 10, width: 40, height: 40 }} onPress={this._onPressAddProduct}>
                    <Image
                        style={{ alignSelf: "center", width: 20, height: 20 }}
                        source={require("../../../Resources/Images/HomeScr/AddButton.png")}
                    />
                </TouchableOpacity>
            </View>
        );
    };

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

    _renderListItem = () => {
        this.arrTextFields = [];
        let textFields = [];
        this.state.arrProducts.map((value, index) => {
            let ref = this._refForProductId(value.id);
            this.arrTextFields.push(ref);
            const product = (
                <View
                    key={value.id}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                    <View style={{ width: "85%" }}>
                        <AppTextField
                            reference={this[`${ref}Ref`]}
                            label={baseLocal.t("Product Name / Description")}
                            value={value.value}
                            selectTextOnFocus={false}
                            textColor={constant.themeColor}
                            baseColor={ value.value.length > 0 ? constant.themeColor : constant.grayShadeColorAA }  
                            tintColor={constant.themeColor}
                            returnKeyType="next"
                            onChangeText={(text) => this._onChangeText(text,ref)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.removeProductBtn}
                        onPress={() => {
                            this._onPressRemoveProduct(value);
                        }}
                    >
                        <Image source={require("../../../Resources/Images/CartScr/BtnRemoveFromCart.png")} />
                    </TouchableOpacity>
                </View>
            );
            textFields.push(product);
        });

        return textFields;
    };

    _updateRef = (name, ref) => {
        this[name] = ref;
    };

    render = () => {
        return (
            // Main View (Container)
            <View style={styles.container}>
                {this._renderCustomNavigationView()}
                <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} />
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                    {this._renderListItem()}
                    {/* <View style={{ width: "80%" }}>{this._renderListItem()}</View> */}

                    {/* // Send Button */}
                    <TouchableOpacity style={styles.loginButtonStyle} onPress={this._onPressSend}>
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "Ebrima",
                                fontWeight: "bold",
                            }}
                        >
                            {baseLocal.t("SEND")}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
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
        suggestProduct: parameters =>
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
        paddingBottom:10,
        //height: Dimensions.get("window").height,
    },
    navigationView: {
        width: "100%",
        // marginTop: -20,
        paddingTop: 20,
        height: 64,
        backgroundColor: constant.themeColor,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    navigationButtonText: {
        fontFamily: constant.themeFont,
        fontSize: 16,
        color: "white",
        marginTop: 8,
    },
    loginButtonStyle: {
        width: "82%",
        marginTop: 20,
        backgroundColor: constant.themeColor,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    removeProductBtn: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginRight: -10,
        width: 40,
        height: 40,
    },
});
