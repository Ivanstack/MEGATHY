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
    ActionSheetIOS,
    AppState,
    SafeAreaView,
    FlatList,
    ScrollView,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../../Helper/CommonStyle";
import constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Components Style
import CategoryStyles from "./CategoryStyles";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";
import * as CommonUtilites from "../../../../Helper/CommonUtilities";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";
import CartScreenStyle from "../CartScreen/CartScreenStyle";

// const AppSocket = new SocketIO('http://192.168.0.7:1339');

class CategoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryData: [],
            subCategoryData: [],
            bannerData: [],
            swipeIndex: 0,
            isRefreshing: false,
            visible: false,
            isSubCategoryScr:
                this.props.navigation.state.params != undefined &&
                this.props.navigation.state.params.category != undefined
                    ? true
                    : false,
        };

        this._callLoadMore = this._callLoadMore.bind(this);

        // Class Props
        (this.currentPage = 1), (this.lastPage = 0), (this.subCategoryCurrentPage = 1), (this.subCategoryLastPage = 0);
        // Temp Prop
        // (this.items = ["January", "February", "March", "April"]);
        // ----------------------------
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
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
                    <Text style={CategoryStyles.headerText}> Meghathy </Text>
                </View>

                {/* <TouchableOpacity onPress={() => navigation.navigate("DrawerToggle")}>
          <Icon
            name="search"
            style={{ marginLeft: 20 }}
            size={25}
            color="white"
          />
        </TouchableOpacity> */}
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    // App Life Cycle Methods

    async componentDidMount() {
        if (this.state.isSubCategoryScr) {
            console.log("App State Subcategory: ", AppState.currentState);
            this._getSubCategoryData(false);
        } else {
            console.log("App State Home: ", AppState.currentState);
            this.getCategoryAndBannerData(false);
        }
    }

    componentWillUnmount() {
        console.log("App State: ", AppState.currentState);
    }

    componentDidUpdate() {
        // console.log('props data :', this.props.firstComp);
    }

    // Mics Methods

    onNavigateBack = () => {
        // Handle navigation back action
        this.forceUpdate();
    };

    _callLoadMore() {
        console.log("Call Load More .....");

        if (this.state.isSubCategoryScr) {
            if (this.subCategoryCurrentPage < this.subCategoryLastPage) {
                this._getSubCategoryData(true);
            }
        } else {
            if (this.currentPage < this.lastPage) {
                this.getCategoryAndBannerData(true);
            }
        }
    }

    _getSubCategoryData(isLoadMore) {
        console.log("Call get subcategory .....");

        // Show Loading View
        this.setState({ visible: true });
        let subCategoryPage = this.subCategoryCurrentPage;

        if (isLoadMore && this.subCategoryCurrentPage < this.subCategoryLastPage) {
            subCategoryPage = subCategoryPage + 1;
        }

        var subCategoryParameters = {
            page: subCategoryPage,
            categoryId: this.props.navigation.state.params.category.PkId,
        };
        console.log("getCategory Parameters :===> ", subCategoryParameters);

        let subCategoryData = networkUtility.getRequest(constant.APIGetSubCategory, subCategoryParameters).then(
            result => {
                let resultData = result.data.data;
                console.log("Get SubCategory :======> ", resultData);
                this.subCategoryCurrentPage = resultData.current_page;
                this.subCategoryLastPage = resultData.last_page;
                let newArrCategory = [...this.state.categoryData, ...resultData.data].filter(
                    (val, id, array) => array.indexOf(val) === id
                );
                console.log("Get SubCategory New Array :======> ", newArrCategory);

                // Hide Loading View
                this.setState({
                    categoryData: newArrCategory,
                    isRefreshing: false,
                    visible: false,
                });
            },
            error => {
                constants.debugLog("\nStatus Code: " + error.status);
                constants.debugLog("\nError Message: " + error);

                // Hide Loading View
                this.setState({ visible: false });

                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                      CommonUtilities.showAlert(error.data["messageAr"]);
                    }
                } else {
                    constants.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
            }
        );
        // }
    }

    getCategoryAndBannerData(isLoadMore) {
        let categoryPage = this.currentPage;

        if (isLoadMore && this.currentPage < this.lastPage) {
            categoryPage = categoryPage + 1;
        }

        var categoryParameters = {
            page: categoryPage,
        };
        console.log("getCategory Parameters :===> ", categoryParameters);

        // Show Loading View
        this.setState({ visible: true });

        let categoryData = networkUtility.getRequest(constant.APIGetCategory, categoryParameters).then(
            result => {
                let resultData = result.data.data;
                console.log("Get Category :======> ", resultData);
                this.currentPage = resultData.current_page;
                this.lastPage = resultData.last_page;
                let newArrCategory = [...this.state.categoryData, ...resultData.data].filter(
                    (val, id, array) => array.indexOf(val) === id
                );

                // Hide Loading View
                this.setState({
                    categoryData: newArrCategory,
                    isRefreshing: false,
                    visible: false,
                });
            },
            error => {
                constants.debugLog("\nStatus Code: " + error.status);
                constants.debugLog("\nError Message: " + error);

                // Hide Loading View
                this.setState({ visible: false });

                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                      CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                      CommonUtilities.showAlert(error.data["message"], false);
                    }
                } else {
                    constants.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
            }
        );

        let bannerData = networkUtility.getRequest(constant.APIGetBanners).then(
            result => {
                // Hide Loading View

                // console.log("Get Category :======> ",data.data.data);
                console.log("Get Banner Data :======> ", result.data.data);
                this.setState({ bannerData: result.data.data });

                // }
            },
            error => {
                constants.debugLog("\nStatus Code: " + error.status);
                constants.debugLog("\nError Message: " + error.message);
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
        if (this.state.isSubCategoryScr) {
            this.subCategoryCurrentPage = 1;
            this.setState(
                // { isRefreshing: true, currentPage: 1, categoryData: [] },
                { isRefreshing: true, categoryData: [] },
                () => {
                    this._getSubCategoryData(false);
                }
            );
        } else {
            this.currentPage = 1;
            this.setState(
                // { isRefreshing: true, currentPage: 1, categoryData: [] },
                { isRefreshing: true, categoryData: [] },
                () => {
                    this.getCategoryAndBannerData(false);
                }
            );
        }
        constant.debugLog("On Refresh call....");
    }

    _onPressCategory(item) {
        console.log("Pass Category :==> ", item);

        if (item.subCategoryCount > 0 && !this.state.isSubCategoryScr) {
            this.props.navigation.navigate(constant.kCategoryScreen, {
                category: item,
            });
        } else {
            this.props.navigation.navigate(constant.kProductScreen, {
                category: item,
            });
        }
    }

    // _renderFooter() {
    //   if (this.currentPage < this.lastPage) {
    //     return (
    //       <View style={CategoryStyles.footer}>
    //         <TouchableOpacity
    //           activeOpacity={0.9}
    //           onPress={this._callLoadMore}
    //           style={CategoryStyles.loadMoreBtn}
    //         >
    //           <Text style={CategoryStyles.btnText}>Load More</Text>
    //           {this.state.fetching_from_server ? (
    //             <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
    //           ) : null}
    //         </TouchableOpacity>
    //       </View>
    //     );
    //   } else {
    //     return <View />;
    //   }
    // }

    _renderHeader() {
        return (
            <View>
                {this.state.isSubCategoryScr ? (
                    <View />
                ) : (
                    <View>
                        <Swiper
                            style={CategoryStyles.bannerWrapper}
                            showPagination
                            autoplay={true}
                            autoplayTimeout={3}
                            autoplayDirection={true}
                            loop={true}
                            // index={0}
                            // onIndexChanged={index => {console.log("Change Swipe Index :==> ", index)}}
                            onMomentumScrollEnd={(e, state, context) => {}}
                            dot={<View style={CategoryStyles.dot} />}
                            activeDot={<View style={CategoryStyles.activeDot} />}
                            paginationStyle={CategoryStyles.pagination}
                        >
                            {this.state.bannerData.length > 0
                                ? this.state.bannerData.map((value, index) => {
                                      return (
                                          <View key={index} style={{ height: "100%", margin: 10 }}>
                                              <ImageLoad
                                                  style={CategoryStyles.image}
                                                  isShowActivity={false}
                                                  placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
                                                  source={{ uri: value.banner_image_url }}
                                              />
                                          </View>
                                      );
                                  })
                                : // <View/>
                                  this.items.map((value, index) => {
                                      return (
                                          <View key={index} style={{ height: 200, margin: 10 }}>
                                              <Image
                                                  style={CategoryStyles.image}
                                                  source={require("../../../../Resources/Images/DefaultProductImage.png")}
                                              />
                                          </View>
                                      );
                                  })}
                        </Swiper>
                    </View>
                )}
            </View>
        );
    }

    _renderSubCategoryItem({ item, index }) {
        console.log("render subcategory item");

        return (
            <TouchableWithoutFeedback
                style={{ backgroundColor: constant.prodCategoryBGColor }}
                onPress={() => this._onPressCategory(item)}
            >
                <View>
                    <View style={CategoryStyles.categoryItemConstainerStyle}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={CategoryStyles.categoryItemNameTxtStyle}>
                                {global.currentAppLanguage === constant.languageArabic
                                    ? item.subCategoryNameAr
                                    : item.subCategoryName}
                            </Text>
                            <Text style={CategoryStyles.categoryProductsCountStyle}>
                                {item.productCount}
                                {" Products"}
                            </Text>
                        </View>

                        <View
                            style={{
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                                // backgroundColor: "gray"
                            }}
                        >
                            <Text
                                style={{
                                    marginRight: 10,
                                    fontSize: 18,
                                    fontFamily: constant.themeFont,
                                    color: "gray",
                                }}
                            >
                                See All
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: "100%", height: 230, marginBottom: 10 }}>
                        <ImageLoad
                            style={{ width: "100%", height: 230, marginBottom: 10 }}
                            isShowActivity={false}
                            placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
                            // loadingStyle={{ size: "large", color: "blue" }}
                            source={{
                                uri: item.subCategoryImageUrl,
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderCategoryItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback
                style={{ backgroundColor: constant.prodCategoryBGColor }}
                onPress={() => this._onPressCategory(item)}
            >
                <View>
                    <View style={CategoryStyles.categoryItemConstainerStyle}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={CategoryStyles.categoryItemNameTxtStyle}>
                                {global.currentAppLanguage === constant.languageArabic
                                    ? item.categoryNameAr
                                    : item.categoryName}
                            </Text>
                            <Text style={CategoryStyles.categoryProductsCountStyle}>
                                {item.productCount}
                                {" Products"}
                            </Text>
                        </View>

                        <View
                            style={{
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                                // backgroundColor: "gray"
                            }}
                        >
                            <Text
                                style={{
                                    marginRight: 10,
                                    fontSize: 18,
                                    fontFamily: constant.themeFont,
                                    color: "gray",
                                }}
                            >
                                See All
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: "100%", height: 230, marginBottom: 10 }}>
                        <ImageLoad
                            style={{ width: "100%", height: 230, marginBottom: 10 }}
                            isShowActivity={false}
                            placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
                            // loadingStyle={{ size: "large", color: "blue" }}
                            source={{
                                uri: item.categoryImageUrl,
                            }}
                        />
                        {/* <View style={CategoryStyles.overlayLayer} /> */}
                        {/* <View
              style={[
                CategoryStyles.overlayLayer,
                {
                  opacity: 1,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center"
                }
              ]}
            >
              <Text
              style={{
                fontSize: 25,
                fontFamily: constant.themeFont,
                color: "white"
              }}
            >
              {item.categoryName}
            </Text>
            </View> */}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _renderCartItemsView = () => {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 10,
                    right: 15,
                }}
            >
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate(constant.kCartScreen, {
                            onNavigateBack: this.onNavigateBack.bind(this),
                        })
                    }
                >
                    <Image
                        style={{ height: 60, width: 60 }}
                        source={require("../../../../Resources/Images/HomeScr/BtnCart.png")}
                    />

                    <View style={CategoryStyles.cartTotalItemsView}>
                        <Text style={CategoryStyles.cartTotalItemsTxt}>{cartFunc.getCartItemsCount()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _renderBannerItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1, backgroundColor: "gray" }}>
                <ImageLoad
                    style={{ width: "100%", height: 230, marginBottom: 10 }}
                    isShowActivity={false}
                    placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
                    source={{
                        uri: item.categoryImageUrl,
                    }}
                />
            </View>
        );
    };

    render() {
        console.log("subCategory :===> ", this.state.subCategoryData);

        return (
            // <View>
            /* <ScrollView
          onScroll={this._onScrollViewEndReached}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        > */

            // <View style={{ backgroundColor: constant.prodCategoryBGColor, flex: 1, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
                <SafeAreaView style={CategoryStyles.container}>
                    {this.state.categoryData.length > 0 ? (
                        <FlatList
                            style={{
                                width: "100%",
                                height: "100%",
                                // backgroundColor: "orange"
                            }}
                            ref={flatList => {
                                this.categoryList = flatList;
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            data={this.state.categoryData}
                            keyExtractor={(item, index) => item.PkId.toString()}
                            renderItem={
                                this.state.isSubCategoryScr
                                    ? this._renderSubCategoryItem.bind(this)
                                    : this._renderCategoryItem.bind(this)
                            }
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={false}
                            directionalLockEnabled
                            onEndReached={this._callLoadMore}
                            onEndReachedThreshold={0.5}
                            ListHeaderComponent={this._renderHeader.bind(this)}
                            // ListFooterComponent={this._renderFooter.bind(this)}
                        />
                    ) : (
                        <Spinner visible={this.state.visible} cancelable={true} textStyle={{ color: "#FFF" }} />
                    )}

                    {!this.state.isSubCategoryScr ? this._renderCartItemsView() : null}
                </SafeAreaView>
            </View>
            /* </ScrollView> */
            // </View>
        );
    }
}

// Store State in store
function mapStateToProps(state, props) {
    return {
        firstComp: state.dataReducer.firstComp,
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryScreen);
