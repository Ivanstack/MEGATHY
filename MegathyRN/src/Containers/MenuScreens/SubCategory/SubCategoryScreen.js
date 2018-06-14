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
import SubCategoryStyles from './SubCategoryStyle'

class SubCategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategoryData: [
        "space-between",
        "space-between",
        "space-between",
        "space-between",
        "space-between"
      ],
      isRefreshing: false
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
          <Text style={SubCategoryStyles.headerText}>
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
    this.setState({ isRefreshing: true });
    // this.getCategoryAndBannerData();
    // fetchData().then(() => {
    //   this.setState({isRefreshing: false});
    // });
  }

  _renderCategoryItem = ({ item, index }) => {
    return (
      <View
        style={SubCategoryStyles.productCountainer}
      >
        <TouchableOpacity>
          <View style={{ marginBottom: 5, backgroundColor: "transparent" }}>
            <ImageLoad
              style={SubCategoryStyles.productImg}
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
              <Text style={SubCategoryStyles.productNameLbl} numberOfLines={2}>
                categoryName
              </Text>
              <Text style={SubCategoryStyles.productQuentityLbl}>1 Pack</Text>
            </View>

            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View>
                <Text style={SubCategoryStyles.productPriceLbl}>SAR 5.5</Text>
              </View>

              {/* <View style={{ backgroundColor: "blue",marginBottom: 2,marginLeft:5 }}> */}
              <TouchableOpacity style={SubCategoryStyles.addProductBtn}>
                <Image
                  style={SubCategoryStyles.addProductImg}
                  source={require("../../../Resources/Images/HomeScr/BtnAddProductWithPlus.png")}
                />
              </TouchableOpacity>
              {/* </View> */}
            </View>
          </View>
        </TouchableOpacity>
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
        <FlatList
          style={{
            backgroundColor: constant.ProdCategoryBGColor,
            marginBottom: 20
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
          keyExtractor={(item, index) => index}
          renderItem={this._renderCategoryItem.bind(this)}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          directionalLockEnabled
          numColumns={2}
        />

        {/* <View style={{ backgroundColor: "pink", flex: 1, marginTop: 10 }}>
            <SafeAreaView style={SubCategoryStyles.container}>
              {this.state.categoryData.length > 0 ? (
                <FlatList
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "orange"
                  }}
                  ref={flatList => {
                    this.categoryList = flatList;
                  }}
                  data={this.state.categoryData}
                  onEndReachedThreshold={0.5}
                  keyExtractor={(item, index) => item.PkId.toString()}
                  renderItem={this._renderCategoryItem.bind(this)}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews={false}
                  directionalLockEnabled
                />
              ) : // </View>
              null}
            </SafeAreaView>
          </View> */}
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
)(SubCategoryScreen);


