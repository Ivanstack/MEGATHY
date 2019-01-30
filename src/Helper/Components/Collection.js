/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  Keyboard
} from "react-native";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import ProductStyles from "../../Containers/MenuScreens/Category/ProductScreen/ProductScrStyle";
// Common file
import * as CommonUtilites from "../CommonUtilities";

import * as constant from "../Constants";
import * as cartFunc from "../Functions/Cart";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

class CollectionView extends Component {
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
        isRefreshing: false
      });
  }

  componentDidMount() {
    console.log("item :===> \n", this.props);
  }

  componentWillUpdate() {
    this.GetOrSaveCartItem(true);
  }

  componentWillUnmount() {
    this.GetOrSaveCartItem(true);
  }

  onSelectedMethod = () => {
      console.log("onSelectedMethod Method Called ......");
      
    if (this.props.onSelectedMethod) {
      this.props.onSelectedMethod(this.props.item);
    }
  };

  //   onSelectedAdd = () => {
  //     if (this.props.onSelectedAdd) {
  //       this.props.onSelectedAdd(this.props.item);
  //     }
  //   };

  onNavigateBack = () => {
    this.GetOrSaveCartItem(false);
    this.forceUpdate();
  };

  async GetOrSaveCartItem(isSaveCartItem) {
    try {
      if (isSaveCartItem) {
        await AsyncStorage.setItem(
          "cartItems",
          JSON.stringify(global.arrCartItems)
        );
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

  render() {
    return (
      <View
        style={{
          width: "50%",
          height: Dimensions.get("window").width / 2 + 80
        }}
      >
        <View style={ProductStyles.productCountainer}>
          <TouchableWithoutFeedback
            onPress={this.onPressAddProduct(this.props.item)}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  marginTop: 15,
                  backgroundColor: "transparent",
                  justifyContent: "space-between",
                  flexDirection: "column"
                }}
              >
                <View>
                  <ImageLoad
                    style={ProductStyles.productImg}
                    isShowActivity={false}
                    placeholderSource={require("../../Resources/Images/DefaultProductImage.png")}
                    source={{
                      uri: this.props.item.productImageUrl
                    }}
                  />
                  <View>
                    <Text
                      style={ProductStyles.productNameLbl}
                      numberOfLines={2}
                    >
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
                    height: 40
                  }}
                >
                  <View>
                    {this.props.item.product_price[0].status ===
                    constant.kProductDiscountActive ? (
                      this._renderPriceCutView(this.props.item)
                    ) : (
                      <Text style={ProductStyles.productPriceLbl}>
                        SAR {this.props.item.product_price[0].price}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={ProductStyles.FavouriteProductBtn}
                    onPress={this.onSelectedMethod}
                  >
                    {this.props.item.isFavourite === 1 ? (
                      <Image
                        style={ProductStyles.addProductImg}
                        source={require("../../Resources/Images/MenuIcons/favouritesActive.png")}
                      />
                    ) : (
                      <Image
                        style={ProductStyles.addProductImg}
                        source={require("../../Resources/Images/MenuIcons/favouritesRed.png")}
                      />
                    )}
                  </TouchableOpacity>
                  favouritesRed
                  <TouchableOpacity
                    style={ProductStyles.addProductBtn}
                    onPress={this.onPressAddProduct(this.props.item)}
                  >
                    <Image
                      style={ProductStyles.addProductImg}
                      source={require("../../Resources/Images/HomeScr/BtnAddProductWithPlus.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {this.props.item.product_price[0].discountType ===
                constant.kProductDiscountPercentage &&
              this.props.item.product_price[0].status ===
                constant.kProductDiscountActive
                ? this._renderProductDiscountView(this.props.item)
                : null}

              {this.props.item.totalAddedProduct > 0 &&
              global.arrCartItems.length > 0 ? (
                <View style={ProductStyles.productSelectBtns}>
                  <TouchableOpacity
                    onPress={this._onPressRemoveProduct(this.props.item)}
                  >
                    <Image
                      style={ProductStyles.selectedProductQuentity}
                      source={require("../../Resources/Images/HomeScr/BtnRemoveProduct.png")}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.onPressAddProduct(this.props.item)}
                  >
                    <View style={ProductStyles.showSelectedProductQuentityView}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: constant.themeFont,
                          color: "white",
                          fontWeight: "400"
                        }}
                      >
                        x{this.props.item.totalAddedProduct}
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
  }

  onPressAddProduct = item => () => {
    console.log(item);

    item.totalAddedProduct = item.totalAddedProduct
      ? item.totalAddedProduct + 1
      : 1;

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

  onPressAddFavoriteProduct = item => () => {
    console.log(item);

    item.totalAddedProduct = item.totalAddedProduct
      ? item.totalAddedProduct + 1
      : 1;

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

  _onPressRemoveProduct = item => () => {
    console.log(item);

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

  _renderPriceCutView = item => {
    return (
      <View>
        <View
          style={{
            alignSelf: "flex-start",
            justifyContent: "center",
            backgroundColor: "transparent"
          }}
        >
          <Text style={ProductStyles.productPriceLbl}>
            SAR {item.product_price[0].price}
          </Text>
          <View>
            <View style={ProductStyles.productPriceCutView} />
          </View>
        </View>

        <View
          style={{ justifyContent: "center", backgroundColor: "transparent" }}
        >
          <Text style={ProductStyles.productPriceLbl}>
            SAR {item.product_price[0].discountPrice}
          </Text>
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
          paddingRight: 10
        }}
      >
        <Text
          style={{
            fontFamily: constant.themeFont,
            fontWeight: "bold",
            fontSize: 10,
            color: "white"
          }}
        >
          {item.product_price[0].hike} % OFF
        </Text>
      </View>
    );
  };
}
export default CollectionView;
