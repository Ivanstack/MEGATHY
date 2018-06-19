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
  AsyncStorage
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../Helper/CommonStyle";
import constant from "../../../Helper/Constants";
import * as cartFunc from "../../../Helper/Functions/Cart";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";

// Network Utility
import * as networkUtility from "../../../Helper/NetworkUtility";

// Components Style
import ProductStyles from "./ProductScrStyle";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";

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
          { name: "space-bet" }
        ],
        productDataList: [],
        isRefreshing: false,
        productQuentity: 0,
        cartItems: 10,
        isReload: true,
      });
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
    this.getProductList();

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
          console.log("Get Array from AsynStorage :====>", global.arrCartItems);
          global.arrCartItems.map(cartItem => {
            this.state.productDataList.map(item => {
              if (cartItem.PkId === item.PkId) {
                item.totalAddedProduct = cartItem.totalAddedProduct;
                console.log("Item changed :===> ", item);
              }
            });
          });

          this.forceUpdate();
        }
      }
    } catch (error) {
      isSaveCartItem
        ? console.log("Error in save Data :===> ", error)
        : console.log("Error in get Data :===> ", error);
    }
  }

  getProductList() {
    // getProduct?categoryId=39&storeId=23&page=1
    let productListUrl =
      constant.getProductList +
      this.props.navigation.state.params.category.PkId +
      constant.storeId +
      "&page=1"; //+this.state.current_page

    let productData = networkUtility.getRequest(productListUrl).then(
      result => {
        // Hide Loading View

        let resultData = result.data.data;
        console.log("Get Products :======> ", resultData.data);
        this.currentPage = resultData.current_page;
        this.lastPage = resultData.last_page;
        // let newArrCategory = [...this.state.categoryData, ...resultData.data].filter((val,id,array) => array.indexOf(val) === id)
        this.setState(
          {
            productDataList: resultData.data,
            isRefreshing: false,
            visible: false
          },
          () => {
            this.GetOrSaveCartItem(false);
          }
        );

        // Show Loading View
        // setTimeout(() => {
        //     this.setState({ visible: false });
        // }, 200);
      },
      error => {
        // Show Loading View
        constants.debugLog("\nStatus Code: " + error.status);
        constants.debugLog("\nError Message: " + error);
        // Show Loading View

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
                placeholderSource={require("../../../Resources/Images/DefaultProductImage.png")}
                // placeholderSource={require("../../../Resources/Images/defaultImg.jpg")}
                // source={require("../../../Resources/Images/defaultImg.jpg")}
                // resizeMode={"contain"}
                // loadingStyle={{ size: "large", color: "blue" }}
                source={{
                  uri: item.productImageUrl
                }}
              />

              <View style={{ marginTop: 10 }}>
                <Text style={ProductStyles.productNameLbl} numberOfLines={2}>
                  {item.productName}
                </Text>
                <Text style={ProductStyles.productQuentityLbl}>
                  {item.productQuntity} {item.productUnit}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View>
                  <Text style={ProductStyles.productPriceLbl}>
                    SAR {item.product_price[0].price}
                  </Text>
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
          {this.state.productDataList.length > 0 ? (
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
                this.productList = flatList;
              }}
              data={this.state.productDataList}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => item.PkId}
              renderItem={this._renderCategoryItem.bind(this)}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
              directionalLockEnabled
              numColumns={2}
            />
          ) : null}

          <View style={ProductStyles.cartContainer}>
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate("CartScreen",{prdtScrContex:this})}>
              <View
                style={{
                  backgroundColor: "white",
                  width: "85%",
                  flex: 1,
                  marginTop: 1
                }}
                onPress={() => this.props.navigation.navigate("CartScreen",{prdtScrContex:this})}
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
                      {cartFunc.getTotalPriceCartItems()}{" "}
                    </Text>
                  </View>

                  <View style={{ width: 2, backgroundColor: "lightgray" }} />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate("CartScreen",{prdtScrContex:this})}>
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
            </TouchableWithoutFeedback>
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
