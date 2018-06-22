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
  AsyncStorage,
  Animated,
  Dimensions,
  TextInput,
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../../Helper/CommonStyle";
import * as constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// Components Style
import CartStyle from "./CartScreenStyle";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";
const orderNowViewHeight = (12 * Dimensions.get("window").height) / 100;

// Variable

class CartScreen extends Component {
  constructor(props) {
    super(props);
    // Class Props
    (this.currentPage = 1),
      (this.lastPage = 0),
      (this.y_translate = new Animated.Value(0));
    //Class State
    this.state = {
      productDataList: [],
      isRefreshing: false,
      productQuentity: 0,
      hideDiscountLbl: true,
      showScheduleOrderNow: false
    };
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

    Animated.spring(this.y_translate, {
      toValue: orderNowViewHeight
    }).start();
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
    this.GetOrSaveCartItem(true);
  }

  componentWillUpdate() {
    // console.log('props data :', this.props.firstComp);
    // this.props.navigation.navigate('FirstScrElement');
    this.GetOrSaveCartItem(true);
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

  _onPressRemoveProduct = (item, removeFromList) => {
    if (item.totalAddedProduct > 0) {
      item.totalAddedProduct = item.totalAddedProduct - 1;
      let oldCartItem = cartFunc.findCartItem(item.PkId);
      let itemIdx = global.arrCartItems.indexOf(oldCartItem);

      if (global.arrCartItems.length > 0) {
        if (item.totalAddedProduct === 0 || removeFromList) {
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
      this.setState({ productQuentity: this.state.productQuentity - 1 });
    }
  };

  _onPressRemoveCartItemFromList = item => {
    Alert.alert(
      "Megathy",
      "Are you sure want to remove this item from the cart?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            this._onPressRemoveProduct(item, true);
          }
        }
      ],
      { cancelable: false }
    );
  };

  _onPressShowHideScheduleOrderNowBtns = () => {
    constant.debugLog("orderNow Called ...");

    if (!this.state.showScheduleOrderNow) {
      this.setState(
        {
          showScheduleOrderNow: true
        },
        () => {
          this.y_translate.setValue(0);
          Animated.spring(this.y_translate, {
            toValue: -1 * orderNowViewHeight
            // friction: 3
          }).start();
        }
      );
    } else {
      this.setState(
        {
          showScheduleOrderNow: false
        },
        () => {
          this.y_translate.setValue(-1 * orderNowViewHeight);
          Animated.spring(this.y_translate, {
            toValue: orderNowViewHeight,
            friction: 5
            // speed: 0.5
          }).start();
        }
      );
    }
  };

  _renderOrderNowModel = () => {
    return (
      // <View>
      //   {this.state.showScheduleOrderNow ? (
      <TouchableWithoutFeedback
        onPress={this._onPressShowHideScheduleOrderNowBtns.bind(this)}
      >
        <View
          style={{
            flex: 1,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -1 * orderNowViewHeight
            // backgroundColor: "orange"
          }}
        >
          <Animated.View
            style={[
              CartStyle.ScheduleAndOrderNowViewStyle,
              {
                transform: [{ translateY: this.y_translate }]
              }
            ]}
          >
            <TouchableOpacity
              style={[CartStyle.scheduleAndOrderBtns, { marginLeft: 20 }]}
              onPress={this._onPressShowHideScheduleOrderNowBtns.bind(this)}
            >
              <Text
                style={{
                  fontFamily: constant.themeFont,
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                {" "}
                Schedule{" "}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[CartStyle.scheduleAndOrderBtns, { marginRight: 20 }]}
              onPress={()=>this.props.navigation.navigate("OrderMasterScreen")}
            >
              <Text
                style={{
                  fontFamily: constant.themeFont,
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                {" "}
                Order Now{" "}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      //   ) : null}
      // </View>
    );
  };

  _renderCartItem = ({ item, index }) => {
    console.log("global array :===> ", global.arrCartItems);

    return (
      <View style={CartStyle.cartItemCountainer}>
        <ImageLoad
          style={CartStyle.cartProductImg}
          isShowActivity={false}
          placeholderSource={require("../../../../Resources/Images/DefaultProductImage.png")}
          // placeholderSource={require("../../../../Resources/Images/defaultImg.jpg")}
          // source={require("../../../../Resources/Images/defaultImg.jpg")}
          // resizeMode={"contain"}
          source={{
            uri: item.productImageUrl
          }}
        />

        <View
          style={{
            marginBottom: 5,
            backgroundColor: "transparent",
            // backgroundColor: "yellow",
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
                {global.currentAppLanguage === constant.languageArabic
                  ? item.productNameAr
                  : item.productName}
              </Text>
              <Text style={CartStyle.cartProductQuentityLbl}>
                {item.productQuntity}{" "}
                {global.currentAppLanguage === constant.languageArabic
                  ? item.productUnitAr
                  : item.productUnit}
              </Text>
            </View>

            <TouchableOpacity
              style={{ position: "absolute", top: 3, right: 10 }}
              onPress={this._onPressRemoveCartItemFromList.bind(
                this,
                item,
                true
              )}
            >
              <Image
                style={CartStyle.selectedProductQuentity}
                source={require("../../../../Resources/Images/CartScr/BtnRemoveAllProductFromCart.png")}
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
                onPress={this._onPressRemoveProduct.bind(this, item, false)}
              >
                <Image
                  style={CartStyle.selectedProductQuentity}
                  source={require("../../../../Resources/Images/CartScr/BtnRemoveFromCart.png")}
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
                  source={require("../../../../Resources/Images/CartScr/BtnAddToCart.png")}
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
      // <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: constant.darkGrayBGColor
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
                // backgroundColor: constant.prodCategoryBGColor,
                marginTop: 5,
                marginBottom: 10
              }}
              ref={flatList => {
                this.cartList = flatList;
              }}
              data={global.arrCartItems}
              keyExtractor={item => item.PkId.toString()}
              renderItem={this._renderCartItem.bind(this)}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
              directionalLockEnabled
              //   numColumns={2}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 17 }}> Your cart is empty</Text>
            </View>
          )}
          {/* <TouchableWithoutFeedback
            onPress={this._onPressShowHideScheduleOrderNowBtns.bind(this)}
          > */}
          <View style={CartStyle.cartContainer}>
            <View
              style={{
                backgroundColor: "white",
                width: "45%",
                flex: 1,
                marginTop: 1,
                flexDirection: "row"
              }}
            >
              <TouchableWithoutFeedback
                onPress={this._onPressShowHideScheduleOrderNowBtns.bind(this)}
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
                    style={{
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={CartStyle.cartImg}
                      source={require("../../../../Resources/Images/ProductScr/CartImageRed.png")}
                    />
                    {this.state.cartItems > 0 ? (
                      <View style={CartStyle.cartBadge}>
                        <Text style={CartStyle.cartItemLbl}>
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
                      style={{
                        fontFamily: constant.themeFont,
                        fontSize: 10
                      }}
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
              </TouchableWithoutFeedback>


              <View style={{
                    width: "60%",}}>
                <TextInput
                  style={{
                    // width: "50%",
                    height: "100%",
                    borderColor: "gray",
                    borderWidth: 1
                  }}
                  // onChangeText={text => this.setState({ text })}
                  // value={this.state.text}
                />
              </View>
            </View>

            {/* <View>
              <TextInput
                style={{
                  width: "100%",
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1
                }}
                // onChangeText={text => this.setState({ text })}
                // value={this.state.text}
              />
            </View> */}

            <TouchableWithoutFeedback
              onPress={this._onPressShowHideScheduleOrderNowBtns.bind(this)}
            >
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
          {/* </TouchableWithoutFeedback> */}
          {this.state.showScheduleOrderNow ? (
            <TouchableWithoutFeedback
              onPress={this._onPressShowHideScheduleOrderNowBtns.bind(this)}
            >
              <View style={CartStyle.overlayLayer} />
            </TouchableWithoutFeedback>
          ) : null}
          {this._renderOrderNowModel()}
        </SafeAreaView>
      </View>
      // </KeyboardAvoidingView>
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
