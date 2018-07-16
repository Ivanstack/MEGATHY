/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AppState,
    SafeAreaView,
    FlatList,
    RefreshControl,
    AsyncStorage,
    Dimensions,
} from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import * as CommonUtilites from "../../../../Helper/CommonUtilities";
import * as constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// Components Style
import ProductStyles from "./ProductScrStyle";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// Class Variable

class ProductScreen extends Component {
    constructor(props) {
        super(props);
        // Class Props
        (this.currentPage = 1),
            (this.lastPage = 0),
            //Class State
            (this.state = {
                productQuentity: 0,
                cartItems: 0,
                isReload: true,
                visible: false,
                isRefreshing: false,
            });
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.state.params.onNavigateBack();
                            navigation.goBack();
                        }}
                    >
                        <Icon name="arrow-left" style={{ marginLeft: 10 }} size={35} color="white" />
                    </TouchableOpacity>
                    <Text style={ProductStyles.headerText}>
                        {global.currentAppLanguage === constant.languageArabic
                            ? navigation.state.params.category.subCategoryName
                                ? navigation.state.params.category.subCategoryNameAr
                                : navigation.state.params.category.categoryNameAr
                            : navigation.state.params.category.subCategoryName
                                ? navigation.state.params.category.subCategoryName
                                : navigation.state.params.category.categoryName}
                    </Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    // App Life Cycle Methods

    async componentDidMount() {
        console.log("App State: ", AppState.currentState);
        console.log("Get Category :===> ", this.props.navigation.state.params.category);
        this.getProductList();
        this._callLoadMore = this._callLoadMore.bind(this);
    }

    componentWillUnmount() {
        console.log("App State: ", AppState.currentState);
        this.GetOrSaveCartItem(true);
    }

    componentWillUpdate() {
        this.GetOrSaveCartItem(true);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.arrProduct.length != 0) {
            this.setState({ visible: false, isRefreshing: false });
            this.GetOrSaveCartItem(false);
        }
    }

    // Mics Methods

    onNavigateBack = () => {
        this.GetOrSaveCartItem(false);
        this.forceUpdate();
    };

    async GetOrSaveCartItem(isSaveCartItem) {
        try {
            if (isSaveCartItem) {
                await AsyncStorage.setItem("cartItems", JSON.stringify(global.arrCartItems));
            } else {
                var oldArrCartItems = await AsyncStorage.getItem("cartItems");
                if (oldArrCartItems !== null) {
                    // We have data!!
                    global.arrCartItems = JSON.parse(oldArrCartItems);
                    this.props.arrProduct.map(item => {
                        if (global.arrCartItems.length > 0) {
                            global.arrCartItems.map(cartItem => {
                                if (cartItem.PkId === item.PkId) {
                                    item.totalAddedProduct = cartItem.totalAddedProduct;
                                }
                                // else {
                                //     item.totalAddedProduct = 0;
                                // }
                            });
                        } else {
                            item.totalAddedProduct = 0;
                        }
                    });
                    // });
                    this.forceUpdate();
                }
            }
        } catch (error) {
            isSaveCartItem
                ? console.log("Error in save Data :===> ", error)
                : console.log("Error in get Data :===> ", error);
        }
    }

    _callLoadMore() {
        console.log("Call Load More .....");

        if (this.props.currentPage < this.props.lastPage) {
            this.getProductList(false, true);
        }
    }

    getProductList(isRefresh = false, isLoadMore = false) {
        let productPage = 1;

        // if (isRefresh || isLoadMore) {
        this.setState({ visible: isRefresh || isLoadMore ? false : true, isRefreshing: isRefresh });
        // }

        if (!isRefresh && isLoadMore && this.props.currentPage < this.props.lastPage) {
            productPage = this.props.currentPage + 1;
        }

        var productParameters = {
            page: productPage,
            categoryId: this.props.navigation.state.params.category.PkId,
        };
        if (this.props.navigation.state.params.category.FkCategoryId) {
            productParameters["subCategoryId"] = this.props.navigation.state.params.category.PkId;
            productParameters["categoryId"] = this.props.navigation.state.params.category.FkCategoryId;
        }
        console.log("getCategory Parameters :===> ", productParameters);

        this.props.getProduct(productParameters);
    }

    _onRefresh() {
        this.getProductList(true);
    }

    _onPressAddProduct = item => {
        item.totalAddedProduct = item.totalAddedProduct ? item.totalAddedProduct + 1 : 1;

        let oldCartItem = cartFunc.findCartItem(item.PkId);

        if (global.arrCartItems.length > 0) {
            if (oldCartItem) {
                console.log("Item is available in arr");
                console.log("Array before replace : ====> ", global.arrCartItems);
                let itemIdx = global.arrCartItems.indexOf(oldCartItem);
                global.arrCartItems.splice(itemIdx, 1, item);
            } else {
                console.log("Item is not available in arr");
                global.arrCartItems.push(item);
            }
        } else {
            console.log("Item is not available in arr");
            global.arrCartItems.push(item);
        }
        this.setState({ productQuentity: this.state.productQuentity + 1 });
    };

    _onPressRemoveProduct = item => {
        if (item.totalAddedProduct > 0) {
            item.totalAddedProduct = item.totalAddedProduct - 1;
            this.setState({ productQuentity: this.state.productQuentity - 1 });
            let oldCartItem = cartFunc.findCartItem(item.PkId);
            let itemIdx = global.arrCartItems.indexOf(oldCartItem);

            if (global.arrCartItems.length > 0) {
                if (item.totalAddedProduct === 0) {
                    global.arrCartItems.splice(itemIdx, 1);
                } else if (oldCartItem) {
                    console.log("Item is available in arr");
                    console.log("Array before replace : ====> ", global.arrCartItems);
                    global.arrCartItems.splice(itemIdx, 1, item);
                    // console.log("Array after replace : ====> ",global.arrCartItems);
                } else {
                    console.log("Item is not available in arr");
                    global.arrCartItems.push(item);
                }
            } else {
                console.log("Item is not available in arr");
                global.arrCartItems.push(item);
            }
        }
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

    _renderCategoryItem = ({ item, index }) => {
        return (
            <View
                style={{
                    width: "50%",
                    height: Dimensions.get("window").width / 2 + 80,
                }}
            >
                <View style={ProductStyles.productCountainer}>
                    <TouchableWithoutFeedback onPress={this._onPressAddProduct.bind(this, item)}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flex: 1,
                                    marginTop: 10,
                                    backgroundColor: "transparent",
                                    justifyContent: "space-between",
                                    flexDirection: "column",
                                }}
                            >
                                <View>
                                    <ImageLoad
                                        style={ProductStyles.productImg}
                                        isShowActivity={false}
                                        placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
                                        source={{
                                            uri: item.productImageUrl,
                                        }}
                                    />

                                    <View>
                                        <Text style={ProductStyles.productNameLbl} numberOfLines={2}>
                                            {global.currentAppLanguage === constant.languageArabic
                                                ? item.productNameAr
                                                : item.productName}
                                        </Text>
                                        <Text style={ProductStyles.productQuentityLbl}>
                                            {item.productQuntity}
                                            {global.currentAppLanguage === constant.languageArabic
                                                ? item.productUnitAr
                                                : item.productUnit}
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
                                        {item.product_price[0].status === constant.kProductDiscountActive ? (
                                            this._renderPriceCutView(item)
                                        ) : (
                                            <Text style={ProductStyles.productPriceLbl}>
                                                SAR {item.product_price[0].price}
                                            </Text>
                                        )}
                                    </View>

                                    {/* <View style={{ backgroundColor: "blue",marginBottom: 2,marginLeft:5 }}> */}
                                    <TouchableOpacity
                                        style={ProductStyles.addProductBtn}
                                        onPress={this._onPressAddProduct.bind(this, item)}
                                    >
                                        <Image
                                            style={ProductStyles.addProductImg}
                                            source={require("../../../../Resources/Images/HomeScr/BtnAddProductWithPlus.png")}
                                        />
                                    </TouchableOpacity>
                                    {/* </View> */}
                                </View>
                            </View>

                            {item.product_price[0].discountType === constant.kProductDiscountPercentage &&
                            item.product_price[0].status === constant.kProductDiscountActive
                                ? this._renderProductDiscountView(item)
                                : null}

                            {item.totalAddedProduct > 0 && global.arrCartItems.length > 0 ? (
                                <View style={ProductStyles.productSelectBtns}>
                                    <TouchableOpacity onPress={this._onPressRemoveProduct.bind(this, item)}>
                                        <Image
                                            style={ProductStyles.selectedProductQuentity}
                                            source={require("../../../../Resources/Images/HomeScr/BtnRemoveProduct.png")}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={this._onPressAddProduct.bind(this, item)}>
                                        <View style={ProductStyles.showSelectedProductQuentityView}>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontFamily: constant.themeFont,
                                                    color: "white",
                                                    fontWeight: "400",
                                                }}
                                            >
                                                x{item.totalAddedProduct}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                {this.state.visible ? (
                    <Spinner visible={this.state.visible} cancelable={true} textStyle={{ color: "#FFF" }} />
                ) : (
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <SafeAreaView
                            style={{
                                flex: 1,
                            }}
                        >
                            {this.props.arrProduct.length > 0 ? (
                                <FlatList
                                    style={{
                                        backgroundColor: constant.prodCategoryBGColor,
                                        marginTop: 5,
                                        marginBottom: 10,
                                        marginRight: 5,
                                    }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.isRefreshing}
                                            onRefresh={this._onRefresh.bind(this)}
                                        />
                                    }
                                    ref={flatList => {
                                        this.productList = flatList;
                                    }}
                                    data={this.props.arrProduct}
                                    extraData={this.props.arrProduct}
                                    keyExtractor={item => item.PkId}
                                    renderItem={this._renderCategoryItem.bind(this)}
                                    showsHorizontalScrollIndicator={false}
                                    directionalLockEnabled
                                    numColumns={2}
                                    onEndReached={this._callLoadMore}
                                />
                            ) : (
                                <View style={{ flex: 1 }} />
                            )}

                            <View style={ProductStyles.cartContainer}>
                                <TouchableWithoutFeedback
                                    onPress={() =>
                                        this.props.navigation.navigate(constant.kCartScreen, {
                                            onNavigateBack: this.onNavigateBack.bind(this),
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            backgroundColor: "white",
                                            width: "85%",
                                            flex: 1,
                                            marginTop: 1,
                                        }}
                                        onPress={() =>
                                            this.props.navigation.navigate(constant.kCartScreen, {
                                                onNavigateBack: this.onNavigateBack.bind(this),
                                            })
                                        }
                                    >
                                        <View
                                            style={{
                                                backgroundColor: "#F5F5F5",
                                                width: "45%",
                                                flex: 1,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Image
                                                    style={ProductStyles.cartImg}
                                                    source={require("../../../../Resources/Images/ProductScr/CartImageRed.png")}
                                                    resizeMode="contain"
                                                />
                                                {/* {this.state.cartItems > 0 ? ( */}
                                                <View style={ProductStyles.cartBadge}>
                                                    <Text style={ProductStyles.cartItemLbl}>
                                                        {cartFunc.getCartItemsCount()}
                                                    </Text>
                                                </View>
                                                {/* ) : null} */}
                                            </View>

                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: constant.themeFont,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    SAR
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: constant.themeFont,
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {cartFunc.getTotalPriceCartItems()}
                                                </Text>
                                            </View>

                                            <View style={{ width: 2, backgroundColor: "lightgray" }} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPress={() =>
                                        this.props.navigation.navigate(constant.kCartScreen, {
                                            onNavigateBack: this.onNavigateBack.bind(this),
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            backgroundColor: "transparent",
                                            width: "15%",
                                            // flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            // marginTop: 1
                                        }}
                                    >
                                        <Image
                                            style={{ height: 25, width: 25 }}
                                            source={require("../../../../Resources/Images/CartScr/BtnRightAero.png")}
                                            resizeMode="contain"
                                        />
                                        {/* <Icon
                                        name="arrow-right"
                                        // style={{ marginLeft: 15 }}
                                        size={35}
                                        color="white"
                                    /> */}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </SafeAreaView>
                    </View>
                )}
            </View>
        );
    }
}

// Store State in store
function mapStateToProps(state, props) {
    return {
        isRefreshing: state.productList.isRefreshing,
        isLoading: state.productList.isLoading,
        isProductSuccess: state.productList.isProductSuccess,
        arrProduct: state.productList.arrProduct,
        currentPage: state.productList.currentPage,
        lastPage: state.productList.lastPage,
        error: state.productList.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getProduct: parameters =>
            dispatch({
                type: constant.actions.getProductRequest,
                payload: { endPoint: constant.APIGetProductList, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductScreen);
