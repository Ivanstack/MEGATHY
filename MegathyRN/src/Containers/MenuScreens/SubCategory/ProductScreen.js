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
  RefreshControl
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../../Helper/CommonStyle";
import constant from "../../../Helper/Constants";

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
      productQuentity: 0
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              style={{ marginLeft: 15 }}
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
    this.getSubCategoryData();
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
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

            <View style={{
                backgroundColor: "transparent",
                width: "15%",
                // flex: 1,
                justifyContent: "center",
                alignItems: 'center',
                // marginTop: 1
              }}>
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
