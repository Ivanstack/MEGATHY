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
import { connect } from "react-redux";

// Common file
import * as constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Components Style
import CategoryStyles from "./CategoryStyles";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility
import * as CommonUtilites from "../../../../Helper/CommonUtilities";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// const AppSocket = new SocketIO('http://192.168.0.7:1339');

class CategoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   categoryData: [],
            //   subCategoryData: [],
            //   bannerData: [],
            // swipeIndex: 0,
            // isRefreshing: false,
            // visible: false,
        };

        this._callLoadMore = this._callLoadMore.bind(this);

        // Class Props
        // (this.currentPage = 1), (this.lastPage = 0), (this.subCategoryCurrentPage = 1), (this.subCategoryLastPage = 0);
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
        console.log("App State Home: ", AppState.currentState);
        this.getCategoryAndBannerData(true);
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

        if (this.props.currentPage < this.props.lastPage) {
            this.getCategoryAndBannerData(false, true);
        }
    }

    getCategoryAndBannerData(isRefresh = false, isLoadMore = false) {
        let categoryPage = 1;

        if (!isRefresh && isLoadMore && this.props.currentPage < this.props.lastPage) {
            categoryPage = this.props.currentPage + 1;
        }

        var categoryParameters = {
            page: categoryPage,
        };

        this.props.getCategories(categoryParameters);
        this.props.getBanners();

        /*
    console.log("getCategory Parameters :===> ", categoryParameters);

    // Show Loading View
    this.setState({ visible: true });

    networkUtility
      .getRequest(constant.APIGetCategory, categoryParameters)
      .then(
        result => {
          let resultData = result.data.data;
          console.log("Get Category :======> ", resultData);
          this.currentPage = resultData.current_page;
          this.lastPage = resultData.last_page;
          let newArrCategory = [
            ...this.state.categoryData,
            ...resultData.data
          ].filter((val, id, array) => array.indexOf(val) === id);

          // Hide Loading View
          this.setState({
            categoryData: newArrCategory,
            isRefreshing: false,
            visible: false
          });
        },
        error => {
          constants.debugLog("\nStatus Code: " + error.status);
          constants.debugLog("\nError Message: " + error);

          // Hide Loading View
          this.setState({ visible: false });

          if (error.status != 500) {
            if (
              global.currentAppLanguage === constant.languageArabic &&
              error.data["messageAr"] != undefined
            ) {
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

    networkUtility.getRequest(constant.APIGetBanners).then(
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
          if (
            global.currentAppLanguage === constant.languageArabic &&
            error.data["messageAr"] != undefined
          ) {
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
    */
    }

    _onRefresh() {
        this.props.currentPage = 1;
        this.getCategoryAndBannerData(true);
        constant.debugLog("On Refresh call....");
    }

    _onPressCategory(item) {
        console.log("Pass Category :==> ", item);

        if (item.subCategoryCount > 0) {
            this.props.navigation.navigate(constant.kSubCategoryScreen, {
                category: item,
                onNavigateBack: this.onNavigateBack.bind(this),
            });
        } else {
            this.props.navigation.navigate(constant.kProductScreen, {
                category: item,
                onNavigateBack: this.onNavigateBack.bind(this),
            });
        }
    }

    _renderHeader() {
        return (
            <View style={{marginTop:8,marginBottom:8, backgroundColor: constant.prodCategoryBGColor,}}>
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
                    {this.props.arrBanners.length > 0
                        ? this.props.arrBanners.map((value, index) => {
                              return (
                                  <View key={index} style={{ height: "100%" }}>
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
                                  <View key={index} style={{ height: 200 }}>
                                      <Image
                                          style={CategoryStyles.image}
                                          source={require("../../../../Resources/Images/DefaultProductImage.png")}
                                      />
                                  </View>
                              );
                          })}
                </Swiper>
            </View>
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
                                    fontSize: 16,
                                    fontFamily: constant.themeFont,
                                    color: "gray",
                                }}
                            >
                                SEE ALL
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: "100%", height: 190 }}>
                        <ImageLoad
                            style={{ width: "100%", height: 180 }}
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
        // console.log("subCategory :===> ", this.state.subCategoryData);

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
                    {this.props.arrCategories.length > 0 ? (
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
                                    refreshing={this.props.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            data={this.props.arrCategories}
                            keyExtractor={(item, index) => item.PkId.toString()}
                            renderItem={this._renderCategoryItem.bind(this)}
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={false}
                            directionalLockEnabled
                            onEndReached={this._callLoadMore}
                            onEndReachedThreshold={0.5}
                            ListHeaderComponent={this._renderHeader.bind(this)}
                            // ListFooterComponent={this._renderFooter.bind(this)}
                        />
                    ) : (
                        <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} />
                    )}

                    {this._renderCartItemsView()}
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
        isRefreshing: state.category.isRefreshing,
        isLoading: state.category.isLoading,
        isCategoriesSuccess: state.category.isCategoriesSuccess,
        isBannersSuccess: state.category.isBannersSuccess,
        arrCategories: state.category.arrCategories,
        currentPage: state.category.currentPage,
        lastPage: state.category.lastPage,
        arrBanners: state.category.arrBanners,
        error: state.category.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCategories: parameters =>
            dispatch({
                type: constant.actions.getCategoryRequest,
                payload: { endPoint: constant.APIGetCategory, parameters: parameters },
            }),
        getBanners: () =>
            dispatch({
                type: constant.actions.getBannerRequest,
                payload: { endPoint: constant.APIGetBanners, parameters: "" },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryScreen);
