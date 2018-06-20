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
import CartStyle from "./CartScreenStyle";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";

class CartScreen extends Component {
  constructor(props) {
    super(props);
    // Class Props
    (this.currentPage = 1),
      (this.lastPage = 0),
      //Class State
      (this.state = {
        productDataList: [],
        isRefreshing: false,
        productQuentity: 0,
        hideDiscountLbl: true
      });
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              //   navigation.state.params.prdtScrContex.setState({ isReload: true });
              navigation.state.params.onNavigateBack();
              navigation.goBack(null);
            }}
          >
            <Icon
              name="arrow-left"
              style={{ marginLeft: 10 }}
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <Text style={CartStyle.headerText}> Shopping Cart </Text>
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
    this.GetOrSaveCartItem(false);
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

  _renderCartItem = ({ item, index }) => {
    console.log("global array :===> ", global.arrCartItems);

    return (
      <View style={CartStyle.cartItemCountainer}>
        <ImageLoad
          style={CartStyle.cartProductImg}
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

        <View
          style={{
            marginBottom: 5,
            backgroundColor: "transparent",
            // backgroundColor: "yellow",
            // width:"100%",
            flex: 1,
            flexDirection: "column"
          }}
        >
          <View
            style={{
              // marginTop: 3,
              flexDirection: "row",
              justifyContent: "space-between",
              // backgroundColor: "gray",
              width: "100%"
            }}
          >
            <View style={{ marginTop: 3 }}>
              <Text style={CartStyle.cartProductNameLbl} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={CartStyle.cartProductQuentityLbl}>
                {item.productQuntity} {item.productUnit}
              </Text>
            </View>

            <TouchableOpacity
              style={{ marginRight: 10, marginTop: 3 }}
              onPress={this._onPressRemoveProduct.bind(this, item)}
            >
              <Image
                style={CartStyle.selectedProductQuentity}
                source={require("../../../Resources/Images/CartScr/BtnRemoveAllProductFromCart.png")}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              // marginTop: 3,
              flexDirection: "row",
              justifyContent: "space-between",
              //   backgroundColor: "red",
              width: "100%"
            }}
          >
            <View style={{ marginTop: 3 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={CartStyle.cartProductPriceLbl}>
                  SAR {item.product_price[0].price}
                </Text>
                {this.state.hideDiscountLbl ? null : (
                  <Text style={CartStyle.cartProductPriceLbl}>
                    SAR {item.product_price[0].price}
                  </Text>
                )}
              </View>
              {this.state.hideDiscountLbl ? null : (
                <Text style={CartStyle.cartProductPriceLbl}>
                  SAR {item.product_price[0].price}
                </Text>
              )}
            </View>

            <View
              style={{
                marginTop: 3,
                flexDirection: "row",
                justifyContent: "space-between",
                // alignItems: "center",
                marginRight: 10
              }}
            >
              <TouchableOpacity
                onPress={this._onPressRemoveProduct.bind(this, item)}
              >
                <Image
                  style={CartStyle.selectedProductQuentity}
                  source={require("../../../Resources/Images/CartScr/BtnRemoveFromCart.png")}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 15,
                  fontFamily: constant.themeFont,
                  margin: 2
                }}
              >
                {" "}
                {item.totalAddedProduct}{" "}
              </Text>

              <TouchableOpacity
                //   style={CartStyle.addProductBtn}
                onPress={this._onPressAddProduct.bind(this, item)}
              >
                <Image
                  style={CartStyle.addProductImg}
                  source={require("../../../Resources/Images/CartScr/BtnAddToCart.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={{ backgroundColor: "blue",marginBottom: 2,marginLeft:5 }}> */}

          {/* </View> */}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#D4D4D4"
        }}
      >
        <SafeAreaView
          style={{
            flex: 1
            // backgroundColor: "yellow"
          }}
        >
          {global.arrCartItems.length > 0 ? (
            <FlatList
              style={{
                // backgroundColor: constant.ProdCategoryBGColor,
                marginTop: 5,
                marginBottom: 10
              }}
              ref={flatList => {
                this.cartList = flatList;
              }}
              data={global.arrCartItems}
              keyExtractor={item => item.PkId}
              renderItem={this._renderCartItem.bind(this)}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
              directionalLockEnabled
              //   numColumns={2}
            />
          ) : null}

          <View style={CartStyle.cartContainer}>
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
                    style={CartStyle.cartImg}
                    source={require("../../../Resources/Images/ProductScr/CartImageRed.png")}
                  />
                  {/* {this.state.cartItems > 0 ? ( */}
                  <View style={CartStyle.cartBadge}>
                    <Text style={CartStyle.cartItemLbl}>
                      {cartFunc.getCartItemsCount()}
                    </Text>
                  </View>
                  {/* ) : null} */}
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
)(CartScreen);
