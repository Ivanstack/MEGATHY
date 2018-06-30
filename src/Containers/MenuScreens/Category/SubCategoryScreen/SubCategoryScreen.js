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
  Dimensions,
  RefreshControl
} from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import * as constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Components Style
import SubCategoryStyles from "./SubCategoryStyles";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";
// const AppSocket = new SocketIO('http://192.168.0.7:1339');

class SubCategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubCategoryScr:
        this.props.navigation.state.params != undefined &&
        this.props.navigation.state.params.category != undefined
          ? true
          : false
    };

    this._callLoadMore = this._callLoadMore.bind(this);

    // Class Props
    // (this.currentPage = 1), (this.subCategoryLastPage = 0), (this.subCategoryCurrentPage = 1), (this.subCategoryLastPage = 0);
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
          <Text style={SubCategoryStyles.headerText}> Meghathy </Text>
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
    console.log("App State Subcategory: ", AppState.currentState);
    this._getSubCategoryData(true);
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

    if (this.props.subCategoryCurrentPage < this.props.subCategoryLastPage) {
      this._getSubCategoryData(false,true);
    }
  }

  _getSubCategoryData(isRefresh=false, isLoadMore=false) {
    console.log("Call get subcategory .....");

    // Show Loading View
    // this.setState({ visible: true });
    let subCategoryPage = 1;

    if (!isRefresh && isLoadMore && this.props.subCategoryCurrentPage < this.props.subCategoryLastPage) {
      subCategoryPage = this.props.subCategoryCurrentPage + 1;
    }

    var subCategoryParameters = {
      page: subCategoryPage,
      categoryId: this.props.navigation.state.params.category.PkId
    };

    this.props.getSubCategories(subCategoryParameters);
  }

  _onRefresh() {
    this.props.subCategoryCurrentPage = 1;
    this._getSubCategoryData(true);
    constant.debugLog("On Refresh call....");
  }

  _onPressCategory(item) {
    console.log("Pass Category :==> ", item);
    this.props.navigation.navigate(constant.kProductScreen, {
      category: item
    });
  }

  _renderHeader() {
    return (
      <View>
        {this.state.isSubCategoryScr ? (
          <View />
        ) : (
          <View>
            <Swiper
              style={SubCategoryStyles.bannerWrapper}
              showPagination
              autoplay={true}
              autoplayTimeout={3}
              autoplayDirection={true}
              loop={true}
              // index={0}
              // onIndexChanged={index => {console.log("Change Swipe Index :==> ", index)}}
              onMomentumScrollEnd={(e, state, context) => {}}
              dot={<View style={SubCategoryStyles.dot} />}
              activeDot={<View style={SubCategoryStyles.activeDot} />}
              paginationStyle={SubCategoryStyles.pagination}
            >
              {this.props.arrBanners.length > 0
                ? this.props.arrBanners.map((value, index) => {
                    return (
                      <View key={index} style={{ height: "100%", margin: 10 }}>
                        <ImageLoad
                          style={SubCategoryStyles.image}
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
                          style={SubCategoryStyles.image}
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
          <View style={SubCategoryStyles.categoryItemConstainerStyle}>
            <View style={{ flexDirection: "column" }}>
              <Text style={SubCategoryStyles.categoryItemNameTxtStyle}>
                {global.currentAppLanguage === constant.languageArabic
                  ? item.subCategoryNameAr
                  : item.subCategoryName}
              </Text>
              <Text style={SubCategoryStyles.categoryProductsCountStyle}>
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
                uri: item.subCategoryImageUrl
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
          <View style={SubCategoryStyles.categoryItemConstainerStyle}>
            <View style={{ flexDirection: "column" }}>
              <Text style={SubCategoryStyles.categoryItemNameTxtStyle}>
                {global.currentAppLanguage === constant.languageArabic
                  ? item.categoryNameAr
                  : item.categoryName}
              </Text>
              <Text style={SubCategoryStyles.categoryProductsCountStyle}>
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
                uri: item.categoryImageUrl
              }}
            />
            {/* <View style={SubCategoryStyles.overlayLayer} /> */}
            {/* <View
              style={[
                SubCategoryStyles.overlayLayer,
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

  render() {
    console.log("subCategory :===> ", this.props.arrSubCategories);

    return (
      // <View style={{ backgroundColor: constant.prodCategoryBGColor, flex: 1, marginTop: 10 }}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={SubCategoryStyles.container}>
          {this.props.arrSubCategories.length > 0 ? (
            <FlatList
              style={{
                width: "100%",
                height: "100%"
                // backgroundColor: "orange"
              }}
              ref={flatList => {
                this.subCategoryList = flatList;
              }}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.isRefreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
              data={this.props.arrSubCategories}
              keyExtractor={(item, index) => item.PkId.toString()}
              renderItem={this._renderSubCategoryItem.bind(this)}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
              directionalLockEnabled
              onEndReached={this._callLoadMore}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <Spinner
              visible={this.props.isLoading}
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
    isRefreshing: state.subcategory.isRefreshing,
    isLoading: state.subcategory.isLoading,
    isSubCategoriesSuccess: state.subcategory.isSubCategoriesSuccess,
    arrSubCategories: state.subcategory.arrSubCategories,
    subCategoryCurrentPage: state.subcategory.subCategoryCurrentPage,
    subCategoryLastPage: state.subcategory.subCategoryLastPage,
    error: state.subcategory.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSubCategories: parameters =>
      dispatch({
        type: constant.actions.getSubCategoryRequest,
        payload: {
          endPoint: constant.APIGetSubCategory,
          parameters: parameters
        }
      })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubCategoryScreen);
