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
  Dimensions
} from "react-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../AppRedux/Actions/actions";

// Common file
import CommonStyles from "../../Helper/CommonStyle";
import constant from "../../Helper/constant";

// Lib
import Icon from "react-native-vector-icons/FontAwesome";
import Swiper from "react-native-swiper";
// import Swiper from "react-native-swiper-flatlist";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// const AppSocket = new SocketIO('http://192.168.0.7:1339');

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: [],
      bannerData: [],
      swipeIndex: 0
    };

    // Temp Prop
    this.items = ['January', 'February', 'March', 'April', 'May', ]; 
    // ----------------------------

    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("DrawerToggle")}>
          <Icon
            name="bars"
            style={{ marginLeft: 20 }}
            size={25}
            color="white"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}> Meghathy </Text>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#CF2526"
    }
  });

  requestChild = () => {
    this.props.getFirstScreenTap();
  };

  // App Life Cycle Methods

  async componentDidMount() {
    console.log("App State: ", AppState.currentState);

    let categoryData = await networkUtility.getRequest(constant.getCategory);
    let bannerData = await networkUtility.getRequest(constant.banners);
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

  async getCategoryAndBannerList() {
    let categoryData = await networkUtility.getRequest(constant.getCategory);
    let bannerData = await networkUtility.getRequest(constant.banners);
    console.log("Category Data :===> ", bannerData);
    this.setState({
      categoryData: categoryData.data.data.data
    });
  }

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

  _renderCategoryItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: "gray" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // marginBottom: 10,
            backgroundColor: "white",
            padding: 5
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ marginLeft: 10, fontSize: 18 }}>
              {" "}
              {item.categoryName}{" "}
            </Text>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 5,
                fontSize: 16,
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
            <Text style={{ marginRight: 10, fontSize: 18, color: "gray" }}>
              {" "}
              See All{" "}
            </Text>
          </View>
        </View>

        <View style={{ width: "100%", height: 230, marginBottom: 10 }}>
          <Image
            style={{ width: "100%", height: 230, marginBottom: 10 }}
            source={require("../../Resources/Images/defaultImg.jpg")}
            // source={{
            //   uri: item.categoryImageUrl
            // }}
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
            <Text style={{ fontSize: 25, color: "white" }}>
              {" "}
              {item.categoryName}{" "}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  _renderBannerItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, backgroundColor: "gray" }}>
        <Image
          style={{
            width: Dimensions.get("window").width - 20,
            height: 220,
            margin: 10
          }}
          source={require("../../Resources/Images/defaultImg.jpg")}
          // source={{
          //   uri: item.categoryImageUrl
          // }}
        />
      </View>
    );
  };

  onViewableItemsChanged({ viewableItems, changed }) {
    console.log("viewableItems", viewableItems[0].index);
    // this.indexAt = viewableItems[0].index;
    console.log("changed", this.indexAt);
  }

  onChangeSwipeIndex = ({ index }) => {
    console.log("Change Swipe Index :==> ", index);
    this.setState({ swipeIndex: index });
  };

  render() {
    return (
      <View>
        <ScrollView>
          <View>
          
            <Swiper
              style={styles.bannerWrapper}
              showPagination
              autoplay={true}
              autoplayTimeout={2}
              autoplayDirection={true}
              loop={true}
              // index={this.state.swipeIndex}
              // onIndexChanged={index => {console.log("Change Swipe Index :==> ", index)}}
              onMomentumScrollEnd={(e, state, context) => {console.log("Change Swipe Index :==> ", state);
              }}
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
              paginationStyle={styles.pagination}
            >
              {this.state.bannerData.length > 0 ? (
                this.state.bannerData.map((value, index) => {
                  return (
                    <View key={index} style={{ height: 100, margin: 10 }}>
                      <Image
                        // onLoadEnd={() => {}}
                        style={styles.image}
                        // source={{ uri: value.background.url }}
                        source={require("../../Resources/Images/defaultImg.jpg")}
                      />
                    </View>
                  );
                })
              ) : (
                this.items.map((value, index) => {
                  return (
                    <View key={index} style={{ height: 100, margin: 10 }}>
                      <Image
                        // onLoadEnd={() => {}}
                        style={styles.image}
                        // source={{ uri: value.background.url }}
                        source={require("../../Resources/Images/defaultImg.jpg")}
                      />
                    </View>
                  );
                })
              )}
            </Swiper>
          </View>
          <View style={{ backgroundColor: "pink", flex: 1 }}>
            <SafeAreaView style={styles.container}>
              {/* <View style={{width: "100%", height: 200, backgroundColor: "orange",}} /> */}

              {/* {this.state.bannerData.length > 0 ? (
            <FlatList
              style={{
                width: "100%",
                height: 250,
                backgroundColor: "blue",
                marginBottom: 10
              }}
              ref={flatList => {
                this.bannerList = flatList;
              }}
              data={this.state.bannerData}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={this._renderBannerItem.bind(this)}
              // onViewableItemsChanged={this.onViewableItemsChanged}
              // viewabilityConfig={this.viewabilityConfig}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={false}
              horizontal
              pagingEnabled
              directionalLockEnabled
            />
          ) : null} */}

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
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
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
    fontSize: 15
  },
  overlayLayer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black"
  },
  bannerWrapper: {
    height: 250,
    backgroundColor: "red"
  },
  slide: {
    width: Dimensions.get("window").width - 10,
    // height:200,
    // justifyContent: "center",
    backgroundColor: "green"
  },
  image: {
    width: Dimensions.get("window").width - 20,
    height: 200
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
