/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  BackHandler,
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
  ActivityIndicator
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../../Helper/CommonStyle";
import constant from "../../../../Helper/Constants";

// Components Style
import CategoryStyles from "./CategoryStyles";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

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
          : false
    };

    this.callLoadMore = this.callLoadMore.bind(this);

    // Class Props
    (this.currentPage = 1),
      (this.lastPage = 0),
      (this.subCategoryCurrentPage = 1),
      (this.subCategoryLastPage = 0);
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
              if (
                navigation.state.params != undefined &&
                navigation.state.params.category != undefined
              ) {
                navigation.goBack();
              } else {
                navigation.navigate("DrawerToggle");
              }
            }}
          >
            <Icon
              name={
                navigation.state.params != undefined &&
                navigation.state.params.category != undefined
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
      backgroundColor: "#CF2526"
    }
  });

  // App Life Cycle Methods

  async componentDidMount() {
    if (this.state.isSubCategoryScr) {
      console.log("App State Subcategory: ", AppState.currentState);
      this.getSubCategoryData(false);
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
  connectSocket = () => {
    // AppSocket.connect()
  };

  callLoadMore() {
    console.log("Call Load More .....");

    if (this.currentPage < this.lastPage) {
      this.getCategoryAndBannerData(true);
    }
  }

  getSubCategoryData(isLoadMore) {
    console.log("Call get subcategory .....");

    // Show Loading View
    this.setState({ visible: true });
    let subCategoryPage = this.subCategoryCurrentPage;

    if (isLoadMore && this.subCategoryCurrentPage < this.subCategoryLastPage) {
      subCategoryPage = subCategoryPage + 1;
    }

    var subCategoryParameters = {
      page: subCategoryPage,
      categoryId: this.props.navigation.state.params.category.PkId
    };
    console.log("getCategory Parameters :===> ", subCategoryParameters);

    let subCategoryData = networkUtility
      .getRequest(constant.getSubCategory, subCategoryParameters)
      .then(
        result => {
          let resultData = result.data.data;
          console.log("Get SubCategory :======> ", resultData);
          this.subCategoryCurrentPage = resultData.current_page;
          this.subCategoryLastPage = resultData.last_page;
          let newArrCategory = [
            ...this.state.categoryData,
            ...resultData.data
          ].filter((val, id, array) => array.indexOf(val) === id);
          console.log("Get SubCategory New Array :======> ", newArrCategory);

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
              setTimeout(() => {
                alert(error.data["messageAr"]);
              }, 200);
            } else {
              setTimeout(() => {
                alert(error.data["message"]);
              }, 200);
            }
          } else {
            constants.debugLog("Internal Server Error: " + error.data);
            setTimeout(() => {
              alert("Something went wrong, plese try again");
            }, 200);
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
      page: categoryPage
    };
    console.log("getCategory Parameters :===> ", categoryParameters);

    // Show Loading View
    this.setState({ visible: true });

    let categoryData = networkUtility
      .getRequest(constant.getCategory, categoryParameters)
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

          // Show Loading View
          // setTimeout(() => {
          //     this.setState({ visible: false });
          // }, 200);
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
              setTimeout(() => {
                alert(error.data["messageAr"]);
              }, 200);
            } else {
              setTimeout(() => {
                alert(error.data["message"]);
              }, 200);
            }
          } else {
            constants.debugLog("Internal Server Error: " + error.data);
            setTimeout(() => {
              alert("Something went wrong, plese try again");
            }, 200);
          }
        }
      );

    let bannerData = networkUtility.getRequest(constant.getBanners).then(
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
            alert(error.data["messageAr"]);
          } else {
            setTimeout(() => {
              alert(error.data["message"]);
            }, 200);
          }
        } else {
          constants.debugLog("Internal Server Error: " + error.data);
          alert("Something went wrong, plese try again");
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
          this.getSubCategoryData(false);
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
      this.props.navigation.navigate("CategoryScreen", { category: item });
    } else {
      this.props.navigation.navigate("ProductScreen", { category: item });
    }
  }

  // _renderFooter() {
  //   if (this.currentPage < this.lastPage) {
  //     return (
  //       <View style={CategoryStyles.footer}>
  //         <TouchableOpacity
  //           activeOpacity={0.9}
  //           onPress={this.callLoadMore}
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
                {" "}
                {global.currentAppLanguage === constant.languageArabic
                  ? item.subCategoryNameAr
                  : item.subCategoryName}{" "}
              </Text>
              <Text style={CategoryStyles.categoryProductsCountStyle}>
                {" "}
                {item.productCount}
                {" Products"}
              </Text>
            </View>

            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end"
                // backgroundColor: "gray"
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  fontSize: 18,
                  fontFamily: constant.themeFont,
                  color: "gray"
                }}
              >
                {" "}
                See All{" "}
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
                uri: item.subCategoryImageUrl
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

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
                {" "}
                {global.currentAppLanguage === constant.languageArabic
                  ? item.categoryNameAr
                  : item.categoryName}{" "}
              </Text>
              <Text style={CategoryStyles.categoryProductsCountStyle}>
                {" "}
                {item.productCount}
                {" Products"}
              </Text>
            </View>

            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end"
                // backgroundColor: "gray"
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  fontSize: 18,
                  fontFamily: constant.themeFont,
                  color: "gray"
                }}
              >
                {" "}
                See All{" "}
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
                uri: item.categoryImageUrl
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
              {" "}
              {item.categoryName}{" "}
            </Text>
            </View> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
            uri: item.categoryImageUrl
          }}
        />
      </View>
    );
  };

  _onScrollViewEndReached(e) {
    var windowHeight = Dimensions.get("window").height,
      height = e.nativeEvent.contentSize.height,
      offset = e.nativeEvent.contentOffset.y;
    if (windowHeight + offset >= height) {
      console.log("End Scroll");
    }
  }

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
                height: "100%"
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
              onEndReached={this.callLoadMore}
              onEndReachedThreshold={0.5}
              ListHeaderComponent={this._renderHeader.bind(this)}
              // ListFooterComponent={this._renderFooter.bind(this)}
            />
          ) : (
            <Spinner
              visible={this.state.visible}
              cancelable={true}
              textStyle={{ color: "#FFF" }}
            />
          )}
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
    firstComp: state.dataReducer.firstComp
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryScreen);
