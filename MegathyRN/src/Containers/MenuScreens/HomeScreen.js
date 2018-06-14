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
import * as actions from "../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../Helper/CommonStyle";
import constant from "../../Helper/Constants";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import ImageLoad from "react-native-image-placeholder";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// const AppSocket = new SocketIO('http://192.168.0.7:1339');

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: [],
      bannerData: [],
      swipeIndex: 0,
      isRefreshing: false,
      isSubCategoryScr:
        this.props.navigation.state.params != undefined &&
        this.props.navigation.state.params.category != undefined
          ? true
          : false
    };

    // Temp Prop
    this.items = ["January", "February", "March", "April", "May"];
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
              style={{ marginLeft: 15 }}
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}> Meghathy </Text>
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
    console.log("App State: ", AppState.currentState);

    let categoryData = await networkUtility.getRequest(constant.getCategory);
    let bannerData = await networkUtility.getRequest(constant.getBanners);
    console.log("Category Data :===> ", bannerData.data.data);
    this.setState({
      categoryData: categoryData.data.data.data,
      bannerData: bannerData.data.data
    });
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
  }

  componentDidUpdate() {
    // console.log('props data :', this.props.firstComp);
    // this.props.navigation.navigate('FirstScrElement');
  }

  // Mics Methods

  onPressActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Destructive Action", "Normal Action"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            console.log("Cancel Press");
          } else if (buttonIndex === 1) {
            /* destructive action */
            console.log("Destructive Action Press");
          } else if (buttonIndex === 2) {
            /* destructive action */
            console.log("Normal Action Press");
          }
        }
      );
    } else {
      Alert: alert("This component not support in your OS");
    }
  };

  connectSocket = () => {
    // AppSocket.connect()
  };

  async getCategoryAndBannerData() {
    let categoryData = networkUtility.getRequest(constant.getCategory).then(
      result => {
        // Hide Loading View
        this.setState({ isRefreshing: !this.state.isRefreshing });

        let statusCode = 0;
        let data = null;

        if (result.response) {
          statusCode = result.response.status;
          data = result.response.data;
        } else {
          statusCode = result.status;
          data = result.data;
        }

        switch (true) {
          case statusCode === 200:
            // console.log("Get Category :======> ",data.data.data);
            console.log("Get Category :======> ",data);
            
            break;

          case statusCode >= 400 && statusCode < 500:
            if (
              global.currentAppLanguage != "en" &&
              data["messageAr"] != undefined
            ) {
              alert(data["messageAr"]);
            } else {
              alert(data["message"]);
            }
            break;
          case statusCode >= 500:
            console.log("Internal Server Error: " + data);
            alert("Something went wrong, plese try again");
            break;
          default:
            console.log("Unknown Status Code: " + statusCode.toString);
            alert("Something went wrong, plese try again");
            break;
        }
        // }
      },
      error => {
        // Show Loading View
        console.log("\nStatus Code: " + error.status);
        console.log("\nError Message: " + error.message);
        if (error.response.status != 500) {
          if (global.currentAppLanguage === "en") {
          } else {
          }
        } else {
          console.log(error.message);
        }
      }
    );
    let bannerData = await networkUtility.getRequest(constant.getBanners);
    console.log("Category Data :===> ", bannerData.data.data);
    this.setState({
      categoryData: categoryData.data.data.data,
      bannerData: bannerData.data.data,
      isRefreshing: false
    });
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this.getCategoryAndBannerData();
  }

  _onPressCategory(item) {
    console.log("Pass Category :==> ", item);

    if (item.subCategoryCount > 0) {
      this.props.navigation.navigate("HomeScreen", { category: item });
    } else {
      this.props.navigation.navigate("SubCategoryScreen", { category: item });
    }
  }

  _renderCategoryItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: constant.ProdCategoryBGColor }}
        onPress={() => this._onPressCategory(item)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // marginBottom: 10,
            backgroundColor: "white",
            paddingTop: 20,
            paddingBottom: 20
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 18,
                fontFamily: constant.themeFont
              }}
            >
              {" "}
              {item.categoryName}{" "}
            </Text>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 5,
                fontSize: 16,
                fontFamily: constant.themeFont,
                color: "gray"
              }}
            >
              {" "}
              {item.subCategoryCount}
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
            placeholderSource={require("../../Resources/Images/DefaultProductImage.png")}
            // loadingStyle={{ size: "large", color: "blue" }}
            source={{
              uri: item.categoryImageUrl
            }}
          />
          <View style={styles.overlayLayer} />
          <View
            style={[
              styles.overlayLayer,
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
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderBannerItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, backgroundColor: "gray" }}>
        <ImageLoad
          style={{ width: "100%", height: 230, marginBottom: 10 }}
          isShowActivity={false}
          placeholderSource={require("../../Resources/Images/DefaultProductImage.png")}
          source={{
            uri: item.categoryImageUrl
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View>
            <Swiper
              style={styles.bannerWrapper}
              showPagination
              autoplay={true}
              autoplayTimeout={2}
              autoplayDirection={true}
              loop={true}
              // index={0}
              // onIndexChanged={index => {console.log("Change Swipe Index :==> ", index)}}
              onMomentumScrollEnd={(e, state, context) => {}}
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
              paginationStyle={styles.pagination}
            >
              {this.state.bannerData.length > 0
                ? this.state.bannerData.map((value, index) => {
                    return (
                      <View key={index} style={{ height: "100%", margin: 10 }}>
                        <ImageLoad
                          style={styles.image}
                          isShowActivity={false}
                          placeholderSource={require("../../Resources/Images/DefaultProductImage.png")}
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
                          style={styles.image}
                          source={require("../../Resources/Images/DefaultProductImage.png")}
                        />
                      </View>
                    );
                  })}
            </Swiper>
          </View>

          <View style={{ backgroundColor: "pink", flex: 1, marginTop: 10 }}>
            <SafeAreaView style={styles.container}>
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
          </View>
        </ScrollView>
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
)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  btnStyle: {
    textAlign: "center",
    color: "#333333",
    // fontSize: 17,
    margin: 5
  },
  headerText: {
    color: "white",
    margin: 4,
    // marginLeft: 5,
    fontSize: 15,
    fontFamily: constant.themeFont
  },
  overlayLayer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    backgroundColor: "black"
  },
  bannerWrapper: {
    height: 170,
    backgroundColor: "transparent"
  },
  slide: {
    width: Dimensions.get("window").width - 10,
    // height:200,
    // justifyContent: "center",
    backgroundColor: "green"
  },
  image: {
    width: Dimensions.get("window").width - 20,
    height: "100%"
    // flex: 1,
  },
  dot: {
    backgroundColor: "#000000",
    opacity: 0.3,
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5
  },
  activeDot: {
    backgroundColor: "white",

    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5
  },
  pagination: {
    bottom: 5
  }
});
