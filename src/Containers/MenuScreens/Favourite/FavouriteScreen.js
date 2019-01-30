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
  RefreshControl,
  AsyncStorage,
  Dimensions
} from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import CommonStyle from "../../../Helper/CommonStyle";
import * as constant from "../../../Helper/Constants";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility

// Components Style

import CollectionView from "../../../Helper/Components/Collection";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";

// Class Variable

class FavouriteScreen extends Component {
  constructor(props) {
    super(props);
    // Class Props
    (this.currentPage = 1),
      (this.lastPage = 0),
      //Class State
      (this.state = {
        arrProduct: []
      });
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DrawerToggle");
            }}
          >
            <Icon
              name="navicon"
              style={{ marginLeft: 10 }}
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <Text style={CommonStyle.headerText}>{baseLocal.t("Favourite")}</Text>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#CF2526"
    }
  });

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

  // _callLoadMore() {
  //     console.log("Call Load More .....");

  //     if (this.props.currentPage < this.props.lastPage) {
  //         this.getProductList(false, true);
  //     }
  // }

  getProductList(isRefresh = false, isLoadMore = false) {
    let productPage = 1;

    // if (isRefresh || isLoadMore) {
    this.setState({
      visible: isRefresh || isLoadMore ? false : true,
      isRefreshing: isRefresh
    });
    // }

    if (
      !isRefresh &&
      isLoadMore &&
      this.props.currentPage < this.props.lastPage
    ) {
      productPage = this.props.currentPage + 1;
    }

    var productParameters = {
      page: productPage,
      categoryId: this.props.navigation.state.params.category.PkId
    };
    if (this.props.navigation.state.params.category.FkCategoryId) {
      productParameters[
        "subCategoryId"
      ] = this.props.navigation.state.params.category.PkId;
      productParameters[
        "categoryId"
      ] = this.props.navigation.state.params.category.FkCategoryId;
    }
    console.log("getCategory Parameters :===> ", productParameters);

    this.props.getProduct(productParameters);
  }

  _onRefresh() {
    this.getProductList(true);
  }

  // App Life Cycle Methods

  async componentDidMount() {
    this.props.dispatchGetFavouriteProduct({ page: this.props.currentPage });
  }

  componentWillUnmount() {}

  componentWillUpdate() {}

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    if (newProps.error) {
      this.setState({ arrProduct: newProps.arrProduct });
    } else {
      this.setState({ arrProduct: newProps.arrProduct });
    }

    if (
      newProps.favourite.isDeleteSuccess &&
      newProps.favourite.isDeleteSuccess != this.props.favourite.isDeleteSuccess
    ) {
      this.props.dispatchGetFavouriteProduct({ page: newProps.lastPage });
    }
    this.GetOrSaveCartItem(false);
  }

  addOrRemoveFaverioutItem = selectedItem => {
    if (selectedItem.isFavourite) {
      this.props.dispatchRemoveFavourite(selectedItem.PkId);
    } else {
      this.props.dispatchAddFavourite(selectedItem.PkId);
    }
  };

  render() {
    return (
      <FlatList
        style={{
          backgroundColor: constant.prodCategoryBGColor,
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10
        }}
        // refreshControl={
        //     <RefreshControl
        //         refreshing={this.state.isRefreshing}
        //     onRefresh={this.props.dispatchGetFavouriteProduct({page:1})}
        //     />
        // }
        ref={flatList => {
          this.productList = flatList;
        }}
        data={this.state.arrProduct}
        extraData={this.state}
        keyExtractor={item => item.PkId}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        numColumns={2}
        onEndReached={this._callLoadMore}
      />
    );
  }

  renderItem = ({ item }) => {
    return (
      <CollectionView
        item={item}
        onSelectedMethod={selectedItem =>
          this.addOrRemoveFaverioutItem(selectedItem)
        }
        // onSelectedAdd={selectedItem => {
        //   this.props.dispatchAddFavourite(selectedItem.PkId);
        // }}
      />
    );
  };
}

function mapStateToProps(state, props) {
  console.log(state);

  return {
    favourite: state.favourite,
    isLoading: state.favourite.isLoading,
    isRefreshing: state.favourite.isRefreshing,
    isProductSuccess: state.favourite.isProductSuccess,
    arrProduct: state.favourite.arrProduct,
    currentPage: state.favourite.currentPage,
    lastPage: state.favourite.lastPage,
    error: state.favourite.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchGetFavouriteProduct: parameters =>
      dispatch({
        type: constant.actions.getFavouriteProductRequest,
        payload: {
          endPoint: constant.APIGetFavouriteProducts,
          parameters: parameters
        }
      }),
    dispatchRemoveFavourite: productId =>
      dispatch({
        type: constant.actions.removeFavouriteProductRequest,
        payload: {
          endPoint: constant.APIRemoveFavouriteProduct + "/" + productId,
          parameters: ""
        }
      }),
    dispatchAddFavourite: productId =>
      dispatch({
        type: constant.actions.addFavouriteProductRequest,
        payload: {
          endPoint: constant.APIAddFavouriteProduct,
          parameters: productId
        }
      })
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavouriteScreen);
