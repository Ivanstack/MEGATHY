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
  RefreshControl,
  ActivityIndicator
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
import Spinner from "react-native-loading-spinner-overlay";

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
      visible: true,
      isSubCategoryScr:
        this.props.navigation.state.params != undefined &&
        this.props.navigation.state.params.category != undefined
          ? true
          : false
    };

    // Class Props
    (this.currentPage = 1),
      (this.lastPage = 0),
      // Temp Prop
      (this.items = ["January", "February", "March", "April", "May"]);
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

    this.getCategoryAndBannerData(false);

    // let categoryData = await networkUtility.getRequest(constant.getCategory);
    // let bannerData = await networkUtility.getRequest(constant.getBanners);
    // console.log("Category Data :===> ", bannerData.data.data);
    // this.setState({
    //   categoryData: categoryData.data.data.data,
    //   bannerData: bannerData.data.data
    // });
  }

  componentWillUnmount() {
    console.log("App State: ", AppState.currentState);
  }

  componentDidUpdate() {
    // console.log('props data :', this.props.firstComp);
    // this.props.navigation.navigate('FirstScrElement');
  }

  // Mics Methods

  connectSocket = () => {
    // AppSocket.connect()
  };

  callLoadMore = () => {
    if (this.currentPage < this.lastPage) {
      this.getCategoryAndBannerData(true);
    }
  };

  getCategoryData() {
    let getCategoryUrl = constant.getCategory + categoryPage;
    console.log("getCategoryUrl :===> ", getCategoryUrl);

    let categoryData = networkUtility.getRequest(getCategoryUrl).then(
      result => {
        // Hide Loading View

        let statusCode = 0;
        let data = null;

        if (result.response) {
          statusCode = result.response.status;
          data = result.response.data.data;
        } else {
          statusCode = result.status;
          data = result.data.data;
        }

        switch (true) {
          case statusCode === 200:
            // console.log("Get Category :======> ",data.data.data);
            console.log("Get Category :======> ", data);
            this.currentPage = data.current_page;
            this.lastPage = data.last_page;
            this.setState({
              categoryData: this.state.categoryData.concat(data.data),
              isRefreshing: !this.state.isRefreshing
              // lastPage: data.last_page,
              // currentPage: data.current_page
            });
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
  }

  async getCategoryAndBannerData(isLoadMore) {
    let categoryPage = this.currentPage;

    if (isLoadMore && this.currentPage < this.lastPage) {
      categoryPage = categoryPage + 1;
    }

    let getCategoryUrl = constant.getCategory + categoryPage;
    console.log("getCategoryUrl :===> ", getCategoryUrl);

    let categoryData = networkUtility.getRequest(getCategoryUrl).then(
      result => {
        // Hide Loading View

        let statusCode = 0;
        // let data = null;

        if (result.response) {
          statusCode = result.response.status;
          // data = result.response.data.data;
        } else {
          statusCode = result.status;
          // data = result.data.data;
        }

        if (statusCode === 200) {
          console.log("Get Category :======> ", data);
          this.currentPage = data.current_page;
          this.lastPage = data.last_page;
          this.setState({
            categoryData: [...this.state.categoryData, ...data.data],
            isRefreshing: !this.state.isRefreshing
            // lastPage: data.last_page,
            // currentPage: data.current_page
          });
        } else {
          setTimeout(() => {
            alert("Something went wrong, plese try again");
          }, 200);
        }

        // Show Loading View
        setTimeout(() => {
          this.setState({ visible: false });
        }, 200);
      },
      error => {
        // Show Loading View
        constants.debugLog("\nStatus Code: " + error.status);
        constants.debugLog("\nError Message: " + error);
        // Show Loading View

        this.setState({ visible: false });

        if (error.status != 500) {
          if (
            global.currentAppLanguage != "en" &&
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

    let bannerData = networkUtility.getRequest(constant.getBanners).then(
      result => {
        // Hide Loading View

        let statusCode = 0;
        let data = null;

        if (result.response) {
          statusCode = result.response.status;
          data = result.response.data;
        } else {
          statusCode = result.status;
          data = result.data;
        }

        if (statusCode === 200) {
          // console.log("Get Category :======> ",data.data.data);
          console.log("Get Banner Data :======> ", data);
          this.setState({ bannerData: data.data });
        }

        // }
      },
      error => {
        constants.debugLog("\nStatus Code: " + error.status);
        constants.debugLog("\nError Message: " + error.message);
        if (error.status != 500) {
          if (
            global.currentAppLanguage != "en" &&
            error.data["messageAr"] != undefined
          ) {
            alert(error.data["messageAr"]);
          } else {
            setTimeout(() => {
              alert(error.data["message"]);
            }, 200);
          }
        } else {
          constants.debugLog("Internal Server Error: " + error.data);
          alert("Something went wrong, plese try again");
        }
      }
    );

    // let bannerData = await networkUtility.getRequest(constant.getBanners);
    // console.log("Category Data :===> ", bannerData.data.data);
    // this.setState({
    //   categoryData: categoryData.data.data.data,
    //   bannerData: bannerData.data.data,
    //   isRefreshing: false
    // });
  }

  _onRefresh() {
    this.currentPage = 1;
    this.setState(
      // { isRefreshing: true, currentPage: 1, categoryData: [] },
      { isRefreshing: true, categoryData: [] },
      () => {
        this.getCategoryAndBannerData(false);
      }
    );
  }

  _onPressCategory(item) {
    console.log("Pass Category :==> ", item);

    if (item.subCategoryCount > 0) {
      this.props.navigation.navigate("HomeScreen", { category: item });
    } else {
      this.props.navigation.navigate("ProductScreen", { category: item });
    }
  }

  _renderFooter() {
    if (this.currentPage < this.lastPage) {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.callLoadMore}
            style={styles.loadMoreBtn}
          >
            <Text style={styles.btnText}>Load More</Text>
            {this.state.fetching_from_server ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View />;
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
            {/* <Text
              style={{
                fontSize: 25,
                fontFamily: constant.themeFont,
                color: "white"
              }}
            >
              {" "}
              {item.categoryName}{" "}
            </Text> */}
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
              autoplayTimeout={3}
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
                  keyExtractor={(item, index) => item.PkId.toString()}
                  renderItem={this._renderCategoryItem.bind(this)}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews={false}
                  directionalLockEnabled
                  // onEndReached={this.callLoadMore.bind(this)}
                  // onEndReachedThreshold={0.8}

                  ListFooterComponent={this._renderFooter.bind(this)}
                />
              ) : (
                <Spinner
                  visible={this.state.visible}
                  cancelable={true}
                  textStyle={{ color: "#FFF" }}
                />
              )}
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
    height: 185,
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
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1.5,
    borderTopColor: "black"
  },

  loadMoreBtn: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center"
  }
});
