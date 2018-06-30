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
    Alert,
    AppState,
    SafeAreaView,
    FlatList,
    RefreshControl,
    AsyncStorage,
    Dimensions,
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../../Helper/CommonStyle";
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

class ProductScreen extends Component {
    constructor(props) {
        super(props);
        // Class Props
        (this.currentPage = 1),
            (this.lastPage = 0),
            //Class State
            (this.state = {
                subCategoryData: [
                    { name: "space-between" },
                    { name: "space-betwee" },
                    { name: "space-betwe" },
                    { name: "space-betw" },
                    { name: "space-bet" },
                ],
                productDataList: [],
                isRefreshing: false,
                productQuentity: 0,
                cartItems: 10,
                isReload: true,
                visible: true,
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
        this.GetOrSaveCartItem(false);
        this.getProductList(false);

        this._callLoadMore = this._callLoadMore.bind(this);

        // this.getSubCategoryData();
    }

    componentWillUnmount() {
        console.log("App State: ", AppState.currentState);
        this.GetOrSaveCartItem(true);
    }

    componentDidUpdate() {
        // console.log('props data :', this.props.firstComp);
        // this.props.navigation.navigate('FirstScrElement');
        this.GetOrSaveCartItem(true);
    }

    // Mics Methods

    onNavigateBack = () => {
        this.GetOrSaveCartItem(false);
        this.forceUpdate();
    };

    async getSubCategoryData() {
        let subCategoryApi = constant.APIGetSubCategory + this.props.navigation.state.params.category.PkId;
        console.log("subCategoryApi :==> ", subCategoryApi);

        let subCategoryData = await networkUtility.getRequest(subCategoryApi);
        console.log("Sub Category Data :===> ", subCategoryData.data.data);
        // this.setState({
        //   categoryData: categoryData.data.data.data,
        //   bannerData: bannerData.data.data,
        //   isRefreshing: false
        // });
    }

    async GetOrSaveCartItem(isSaveCartItem) {
        try {
            if (isSaveCartItem) {
                await AsyncStorage.setItem("cartItems", JSON.stringify(global.arrCartItems));
            } else {
                var oldArrCartItems = await AsyncStorage.getItem("cartItems");
                if (oldArrCartItems !== null) {
                    // We have data!!
                    global.arrCartItems = JSON.parse(oldArrCartItems);
                    if (global.arrCartItems.length > 0) {
                        global.arrCartItems.map(cartItem => {
                            this.state.productDataList.map(item => {
                                if (cartItem.PkId === item.PkId) {
                                    item.totalAddedProduct = cartItem.totalAddedProduct;
                                }
                                // else {
                                //   item.totalAddedProduct = 0;
                                // }
                            });
                        });
                    } else {
                        item.totalAddedProduct = 0;
                    }
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

        if (this.currentPage < this.lastPage) {
            this.getProductList(true);
        }
    }

    getProductList(isLoadMore) {
        // getProduct?categoryId=39&storeId=23&page=1
        // let productListUrl =
        //   constant.APIGetProductList +
        //   this.props.navigation.state.params.category.PkId +
        //   constant.storeId +
        //   "&page=1"; //+this.state.current_page.
        let productPage = this.currentPage;

        if (isLoadMore && this.currentPage < this.lastPage) {
            productPage = productPage + 1;
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

        let productData = networkUtility.getRequest(constant.APIGetProductList, productParameters).then(
            result => {
                // Hide Loading View

                let resultData = result.data.data;
                console.log("Get Products :======> ", resultData);
                this.currentPage = resultData.current_page;
                this.lastPage = resultData.last_page;
                let newArrProduct = [...this.state.productDataList, ...resultData.data].filter(
                    (val, id, array) => array.indexOf(val) === id
                );
                this.setState(
                    {
                        productDataList: newArrProduct,
                        isRefreshing: false,
                        visible: false,
                    },
                    () => {
                        this.GetOrSaveCartItem(false);
                    }
                );
            },
            error => {
                // Show Loading View
                constants.debugLog("\nStatus Code: " + error.status);
                constants.debugLog("\nError Message: " + error);
                // Show Loading View

                this.setState({ visible: false });

                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilites.showAlert(error.data["messageAr"], false);
                    } else {
                        CommonUtilites.showAlert(error.data["message"], false);
                    }
                } else {
                    constants.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
            }
        );
    }

    _onRefresh() {
        this.currentPage = 1;
        this.setState({ isRefreshing: true, productDataList: [] });
        this.getProductList(false);
    }

    _onPressAddProduct = item => {
        item.totalAddedProduct = item.totalAddedProduct ? item.totalAddedProduct + 1 : 1;
        this.setState({ productQuentity: this.state.productQuentity + 1 });

        let oldCartItem = cartFunc.findCartItem(item.PkId);

        if (global.arrCartItems.length > 0) {
            if (oldCartItem) {
                console.log("Item is available in arr");
                console.log("Array before replace : ====> ", global.arrCartItems);
                let itemIdx = global.arrCartItems.indexOf(oldCartItem);
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

        // }

        // item["totalAddedProduct"] = item.totalAddedProduct
        //   ? item["totalAddedProduct"] + 1
        //   : 1;
        console.log("totalAddedProduct :===> ", item);
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
                    // borderRightWidth: 10,
                    // borderLeftWidth: 10,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    // width: "40%",
                    flex: 1,
                    height: 20,
                    position: "absolute",
                    top: 45,
                    paddingLeft: 5,
                    // padding: 15,
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
            <View style={{ alignSelf: "flex-start" }}>
                <View style={{ justifyContent: "center" }}>
                    <View style={ProductStyles.productPriceCutView} />
                    <Text style={ProductStyles.productPriceLbl}>SAR {item.product_price[0].price}</Text>
                </View>

                <View>
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
                                        // placeholderSource={require("../../../../Resources/Images/defaultImg.jpg")}
                                        // source={require("../../../Resources/../Images/defaultImg.jpg")}
                                        // resizeMode={"contain"}
                                        // loadingStyle={{ size: "large", color: "blue" }}
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
                                        // paddingTop: 20,
                                        // flex:1,
                                        // marginTop: 20,
                                        marginBottom: 5,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        height: 40,
                                        // backgroundColor: "red",
                                        // position: "relative",
                                        // left:0,
                                        // bottom:5,
                                    }}
                                >
                                    <View>
                                        {/* <Text
                      style={
                        item.product_price[0].status ===
                        constant.kProductDiscountActive
                          ? ProductStyles.productDiscountPriceLbl
                          : ProductStyles.productPriceLbl
                      }
                    >
                      SAR {item.product_price[0].price}
                    </Text> */}
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
                    // backgroundColor: "yellow"
                }}
            >
                {this.state.visible ? (
                    <Spinner visible={this.state.visible} cancelable={true} textStyle={{ color: "#FFF" }} />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            // backgroundColor: "yellow"
                        }}
                    >
                        <SafeAreaView
                            style={{
                                flex: 1,
                                // backgroundColor: "yellow"
                            }}
                        >
                            {this.state.productDataList.length > 0 ? (
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
                                    data={this.state.productDataList}
                                    keyExtractor={(item, index) => item.PkId}
                                    renderItem={this._renderCategoryItem.bind(this)}
                                    showsHorizontalScrollIndicator={false}
                                    removeClippedSubviews={false}
                                    directionalLockEnabled
                                    numColumns={2}
                                    onEndReached={this._callLoadMore}
                                />
                            ) : null}

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
                                                />
                                                {this.state.cartItems > 0 ? (
                                                    <View style={ProductStyles.cartBadge}>
                                                        <Text style={ProductStyles.cartItemLbl}>
                                                            {cartFunc.getCartItemsCount()}
                                                        </Text>
                                                    </View>
                                                ) : null}
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
                                        <Icon
                                            name="arrow-right"
                                            // style={{ marginLeft: 15 }}
                                            size={35}
                                            color="white"
                                        />
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
        // firstComp: state.firstComp,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductScreen);
