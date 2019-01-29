/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions, Keyboard } from "react-native";
import { Text, View, TouchableOpacity, ScrollView, Image, TouchableWithoutFeedback } from "react-native";
import ProductStyles from '../../Containers/MenuScreens/Category/ProductScreen/ProductScrStyle'
// Common file
import * as CommonUtilites from "../CommonUtilities";

import * as constant from "../Constants";
import * as cartFunc from "../Functions/Cart";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

class CollectionView extends Component {

    componentDidMount() {
        console.log("item :===> \n", this.props.item);

    }

    onSelectedMethod = () => {
        console.log("item :===> \n", this.props.item);
        if (this.props.onSelectedMethod) {

            this.props.onSelectedMethod(this.props.item)
        }
    }

    render() {
        return (
            <View
                style={{
                    width: "50%",
                    height: Dimensions.get("window").width / 2 + 80,
                }}
            >
                <View style={ProductStyles.productCountainer}>
                    <TouchableWithoutFeedback onPress={this._onPressAddProduct}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flex: 1,
                                    marginTop: 15,
                                    backgroundColor: "transparent",
                                    justifyContent: "space-between",
                                    flexDirection: "column",
                                }}
                            >
                                <View>
                                    <ImageLoad
                                        style={ProductStyles.productImg}
                                        isShowActivity={false}
                                        placeholderSource={require("../../Resources/Images/DefaultProductImage.png")}
                                        source={{
                                            uri: this.props.item.productImageUrl,
                                        }}
                                    />
                                    <View>
                                        <Text style={ProductStyles.productNameLbl} numberOfLines={2}>
                                            {global.currentAppLanguage === constant.languageArabic
                                                ? this.props.item.productNameAr
                                                : this.props.item.productName}
                                        </Text>
                                        <Text style={ProductStyles.productQuentityLbl}>
                                            {this.props.item.productQuntity}
                                            {global.currentAppLanguage === constant.languageArabic
                                                ? this.props.item.productUnitAr
                                                : this.props.item.productUnit}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        marginBottom: 5,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        height: 40,
                                    }}
                                >
                                    <View>
                                        {this.props.item.product_price[0].status === constant.kProductDiscountActive ? (
                                            this._renderPriceCutView(this.props.item)
                                        ) : (
                                                <Text style={ProductStyles.productPriceLbl}>
                                                    SAR {this.props.item.product_price[0].price}
                                                </Text>
                                            )}
                                    </View>
                                    <TouchableOpacity style={ProductStyles.FavouriteProductBtn} onPress={this.onSelectedMethod}>
                                        {this.props.item.isFavourite === 1 ? (<Image
                                            style={ProductStyles.addProductImg}
                                            source={require("../../Resources/Images/MenuIcons/favouritesActive.png")} />) : null}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={ProductStyles.addProductBtn}
                                    //onPress={}
                                    >
                                        <Image
                                            style={ProductStyles.addProductImg}
                                            source={require("../../Resources/Images/HomeScr/BtnAddProductWithPlus.png")} />
                                    </TouchableOpacity>


                                </View>
                            </View>

                            {this.props.item.product_price[0].discountType === constant.kProductDiscountPercentage &&
                                this.props.item.product_price[0].status === constant.kProductDiscountActive
                                ? this._renderProductDiscountView(this.props.item)
                                : null}

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    _renderPriceCutView = item => {
        return (
            <View>
                <View style={{ alignSelf: "flex-start", justifyContent: "center", backgroundColor: "transparent" }}>
                    <Text style={ProductStyles.productPriceLbl}>SAR {item.product_price[0].price}</Text>
                    <View>
                        <View style={ProductStyles.productPriceCutView} />
                    </View>
                </View>

                <View style={{ justifyContent: "center", backgroundColor: "transparent" }}>
                    <Text style={ProductStyles.productPriceLbl}>SAR {item.product_price[0].discountPrice}</Text>
                </View>
            </View>
        );
    };

    _renderProductDiscountView = item => {
        return (
            <View
                style={{
                    backgroundColor: constant.themeColor,
                    borderColor: "transparent",
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    flex: 1,
                    height: 20,
                    position: "absolute",
                    top: 45,
                    paddingLeft: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingRight: 10,
                }}
            >
                <Text
                    style={{
                        fontFamily: constant.themeFont,
                        fontWeight: "bold",
                        fontSize: 10,
                        color: "white",
                    }}
                >
                    {item.product_price[0].hike} % OFF
                </Text>
            </View>
        );
    };
}
export default (CollectionView)