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
  AsyncStorage
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../Helper/CommonStyle";
import constant from "../../../Helper/Constants";
import * as cartFunc from '../../../Helper/Functions/Cart'

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";

// Network Utility
import * as networkUtility from "../../../Helper/NetworkUtility";

// Components Style
import ProductStyles from "./ProductScrStyle";

class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategoryData: [
        { name: "space-between" },
        { name: "space-betwee" },
        { name: "space-betwe" },
        { name: "space-betw" },
        { name: "space-bet" }
      ],
      isRefreshing: false,
      productQuentity: 0,
      cartItems: 10
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              style={{ marginLeft: 10 }}
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <Text style={ProductStyles.headerText}>
            {" "}
            {navigation.state.params.category.categoryName}{" "}
          </Text>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#CF2526"
    }
  });

  // App Life Cycle Methods

  async componentDidMount() {
    console.log("App State: ", AppState.currentState);
    console.log(
      "Get Category :===> ",
      this.props.navigation.state.params.category
    );
    this.GetOrSaveCartItem(false);
    // this.getSubCategoryData();
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
    this.GetOrSaveCartItem(true);
  }

  componentDidUpdate() {
    // console.log('props data :', this.props.firstComp);
    // this.props.navigation.navigate('FirstScrElement');
  }

  // Mics Methods
  async getSubCategoryData() {
    let subCategoryApi =
      constant.getSubCategory +
      this.props.navigation.state.params.category.PkId;
    console.log("subCategoryApi :==> ", subCategoryApi);

    let subCategoryData = await networkUtility.getRequest(subCategoryApi);
    console.log("Sub Category Data :===> ", subCategoryData.data.data);
    // this.setState({
    //   categoryData: categoryData.data.data.data,
    //   bannerData: bannerData.data.data,
    //   isRefreshing: false
    // });
  }
  async GetCartItem() {
    try {
      await AsyncStorage.getItem("cartItems")
        .then(JSON.parse)
        .then(oldArrCartItems => {
          if (oldArrCartItems !== null) {
            // We have data!!
            // let oldData = JSON.parse(oldArrCartItems);

            console.log(
              "Check Array from AsynStorage :====>",
              Array.isArray(oldArrCartItems)
            );
            console.log("Get Array from AsynStorage :====>", oldArrCartItems);
            return oldArrCartItems;
          } else {
            return [];
          }
        });
    } catch (error) {
      isSaveCartItem
        ? console.log("Error in save Data :===> ", error)
        : console.log("Error in get Data :===> ", error);
      return [];
    }
  }

  async SaveCartItem() {
    try {
      await AsyncStorage.setItem(
        "cartItems",
        JSON.stringify(global.arrCartItems)
      );
      console.log(
        "Save Array in AsynStorage :====>",
        JSON.stringify(global.arrCartItems)
      );
    } catch (error) {
      isSaveCartItem
        ? console.log("Error in save Data :===> ", error)
        : console.log("Error in get Data :===> ", error);
    }
  }

  async GetOrSaveCartItem(isSaveCartItem) {
    try {
      if (isSaveCartItem) {
        await AsyncStorage.setItem(
          "cartItems",
          JSON.stringify(global.arrCartItems)
        );
        console.log(
          "Save Array in AsynStorage :====>",
          JSON.stringify(global.arrCartItems)
        );
      } else {
        var oldArrCartItems = await AsyncStorage.getItem("cartItems");
        if (oldArrCartItems !== null) {
          // We have data!!
          global.arrCartItems = JSON.parse(oldArrCartItems);

          global.arrCartItems.map(cartItem => {
            this.state.subCategoryData.map(item => {
              if (cartItem.name === item.name) {
                item.totalAddedProduct = cartItem.totalAddedProduct;
                console.log("Item changed :===> ", item);
              }
            });
          });
          console.log("Get Array from AsynStorage :====>", oldArrCartItems);
          this.forceUpdate();
        }
      }
    } catch (error) {
      isSaveCartItem
        ? console.log("Error in save Data :===> ", error)
        : console.log("Error in get Data :===> ", error);
    }
  }

  _onRefresh() {
    // this.setState({ isRefreshing: true });
    // this.getCategoryAndBannerData();
    // fetchData().then(() => {
    //   this.setState({isRefreshing: false});
    // });
  }

  _onPressAddProduct = item => {
    item.totalAddedProduct = item.totalAddedProduct
      ? item.totalAddedProduct + 1
      : 1;
    this.setState({ productQuentity: this.state.productQuentity + 1 });
    global.arrCartItems.map((cartItem)=>{
      if (cartItem.name === item.name) {
        console.log("Item is available in arr");
        console.log("Array before replace : ====> ", global.arrCartItems);
  
        // let itemIdx = global.arrCartItems.indexOf(item)
        // global.arrCartItems.splice(itemIdx, 1, item)
        // console.log("Array after replace : ====> ",global.arrCartItems);
      } else {
        console.log("Item is not available in arr");
        global.arrCartItems.push(item);
      }
    })
    
    // item["totalAddedProduct"] = item.totalAddedProduct
    //   ? item["totalAddedProduct"] + 1
    //   : 1;
    console.log("totalAddedProduct :===> ", item);
  };

  _onPressRemoveProduct = item => {
    if (item.totalAddedProduct > 0) {
      item.totalAddedProduct = item.totalAddedProduct - 1;
      this.setState({ productQuentity: this.state.productQuentity - 1 });
    }
  };

  _renderCategoryItem = ({ item, index }) => {
    console.log("global array :===> ", global.arrCartItems);

    return (
      <View style={ProductStyles.productCountainer}>
        <TouchableWithoutFeedback
          onPress={this._onPressAddProduct.bind(this, item)}
        >
          <View>
            <View style={{ marginBottom: 5, backgroundColor: "transparent" }}>
              <ImageLoad
                style={ProductStyles.productImg}
                isShowActivity={false}
                // placeholderSource={require("../../../Resources/Images/DefaultProductImage.png")}
                placeholderSource={require("../../../Resources/Images/defaultImg.jpg")}
                source={require("../../../Resources/Images/defaultImg.jpg")}
                // resizeMode={"contain"}
                // loadingStyle={{ size: "large", color: "blue" }}
                // source={{
                //   uri: item.categoryImageUrl
                // }}
              />

              <View style={{ marginTop: 10 }}>
                <Text style={ProductStyles.productNameLbl} numberOfLines={2}>
                  categoryName
                </Text>
                <Text style={ProductStyles.productQuentityLbl}>1 Pack</Text>
              </View>

              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View>
                  <Text style={ProductStyles.productPriceLbl}>SAR 5.5</Text>
                </View>

                {/* <View style={{ backgroundColor: "blue",marginBottom: 2,marginLeft:5 }}> */}
                <TouchableOpacity
                  style={ProductStyles.addProductBtn}
                  onPress={this._onPressAddProduct.bind(this, item)}
                >
                  <Image
                    style={ProductStyles.addProductImg}
                    source={require("../../../Resources/Images/HomeScr/BtnAddProductWithPlus.png")}
                  />
                </TouchableOpacity>
                {/* </View> */}
              </View>
            </View>

            {item.totalAddedProduct > 0 ? (
              <View style={ProductStyles.productSelectBtns}>
                <TouchableOpacity
                  onPress={this._onPressRemoveProduct.bind(this, item)}
                >
                  <Image
                    style={ProductStyles.selectedProductQuentity}
                    source={require("../../../Resources/Images/HomeScr/BtnRemoveProduct.png")}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this._onPressAddProduct.bind(this, item)}
                >
                  <View style={ProductStyles.showSelectedProductQuentityView}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: constant.themeFont,
                        color: "white"
                      }}
                    >
                      {" "}
                      x{item.totalAddedProduct}{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1
          // backgroundColor: "yellow"
        }}
      >
        <SafeAreaView
          style={{
            flex: 1
            // backgroundColor: "yellow"
          }}
        >
          <FlatList
            style={{
              backgroundColor: constant.ProdCategoryBGColor,
              marginTop: 5,
              marginBottom: 10
            }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            ref={flatList => {
              this.subCategoryList = flatList;
            }}
            data={this.state.subCategoryData}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => item.name}
            renderItem={this._renderCategoryItem.bind(this)}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            directionalLockEnabled
            numColumns={2}
          />

          <View style={ProductStyles.cartContainer}>
            <View
              style={{
                backgroundColor: "white",
                width: "85%",
                flex: 1,
                marginTop: 1
              }}
            >
              <View
                style={{
                  backgroundColor: "#F5F5F5",
                  width: "45%",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Image
                    style={ProductStyles.cartImg}
                    source={require("../../../Resources/Images/ProductScr/CartImageRed.png")}
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
                    flexDirection: "column"
                  }}
                >
                  <Text
                    style={{ fontFamily: constant.themeFont, fontSize: 10 }}
                  >
                    {" "}
                    SAR{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: constant.themeFont,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    62.00{" "}
                  </Text>
                </View>

                <View style={{ width: 2, backgroundColor: "lightgray" }} />
              </View>
            </View>

            <View
              style={{
                backgroundColor: "transparent",
                width: "15%",
                // flex: 1,
                justifyContent: "center",
                alignItems: "center"
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
          </View>
        </SafeAreaView>
      </View>
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
)(ProductScreen);
