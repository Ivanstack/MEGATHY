/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions, Keyboard } from "react-native";
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
    ImageBackground,
    RefreshControl,
    Animated,
} from "react-native";
import { connect } from "react-redux"; // Redux
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import Swiper from "react-native-swiper";

import * as constant from "../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../Helper/NetworkUtility"; // Network Utility
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization
import styles from "./WalletStyle";

import moment from "moment";

//Common Styles
import CommonStyle from "../../../Helper/CommonStyle"

//Lib
import Icon from "react-native-vector-icons/EvilIcons";

const filterAll = "all";
const filterPaid = "paid";
const filterReceived = "received";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

let arrWalletType = [constant.kWalletTypeAll, constant.kWalletTypeRedeemed, constant.kWalletTypeCollected];

class WalletScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            filterType: filterAll,
            currentPosition: 0,
            scrollY: new Animated.Value(0),
            navigationTitleIndex: 0
        };
        this.arrShowWallet = [];
        this.segment_X_Translate = new Animated.Value(0);
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View
                style={{ flexDirection: "row", justifyContent: "flex-start", flex: 1 }}
            >
                <View style={{ flexDirection: "row", width: "100%" }}>
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
                            style={{ marginLeft: 10, marginTop: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <FlatList
                        ref={list => (navigation.chatList = list)}
                        style={styles.navigationFlatList}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        pagingEnabled={true}
                        data={navigation.getParam("navigationHeaderData")}
                        keyExtractor={item => item.id.toString()}
                        renderItem={item => (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    height: 44,
                                    justifyContent: "center"
                                }}
                            >
                                <Text style={styles.navigationHeaderText}>
                                    {item.item.name}
                                </Text>
                                {item.item.value ? (
                                    <Text style={styles.navigationHeaderText}>
                                        {item.item.value}
                                    </Text>
                                ) : null}
                            </View>
                        )}
                    />

                    {/* <Text style={CommonStyle.headerText}>{baseLocal.t("My Rewards Wallet")}</Text> */}
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor
        }
    });
    componentDidMount = () => {
        Animated.timing(this.segment_X_Translate, {
            toValue: 0,
            duration: 1.5
        }).start();

        var navigationHeaderData = [
            {
                id: 0,
                name: "My Rewards Wallet"
            },
            {
                id: 1,
                name: "Wallet Balance",
                value: "SAR " + global.currentSettings.total_reward_sr
            }
        ];
        this.props.navigation.setParams({
            navigationHeaderData: navigationHeaderData
        });
        this._getWalletHistoryForAllType();
    };

    componentWillReceiveProps = newProps => {
        if (newProps.isWalletSuccess) {
            this.setState({ filterType: arrWalletType[this.state.currentPosition] });
        }
    };

    _getWalletHistoryForAllType = () => {
        arrWalletType.map(value => {
            var walletParameters = {
                page: 1,
                type: value
            };

            this.props.getWalletHistory(walletParameters);
        });
    };

    _getWalletHistory = (isRefresh = false, isLoadMore = false) => {
        let orderHistoryPage = 1;
        if (
            !isRefresh &&
            isLoadMore &&
            this.props.currentPage < this.props.lastPage
        ) {
            orderHistoryPage = this.props.currentPage + 1;
        }

        var walletParameters = {
            page: orderHistoryPage,
            type: arrWalletType[this.state.currentPosition]
        };

        this.props.getWalletHistory(walletParameters);
    };

    _onRefresh() {
        this._getWalletHistory(true);
        constant.debugLog("On Refresh call....");
    }

    _callLoadMore() {
        console.log("Call Load More .....");

        // if (this.props.currentPage < this.props.lastPage) {
        //     this._getWalletHistory(false, true);
        // }
    }

    _onPageChange(position) {
        // constant.debugLog("Change Index _onPageChange :==> " + position);
        // Keyboard.dismiss();
        if (position < 0) {
            position = 0;
        } else if (position >= 3) {
            position = 2;
        }
        this.setState(
            { currentPosition: position, scrollY: new Animated.Value(0) },
            () => {
                Animated.timing(this.segment_X_Translate, {
                    toValue: position,
                    duration: 300
                }).start();
            }
        );
    }

    _onPressSegmentBtn = segment => {
        let scrollIndex = segment - this.state.currentPosition;
        constant.debugLog("scroll index :===> " + scrollIndex);
        this._swiper.scrollBy(scrollIndex, true); // scrollby in 1,-1
        this.walletList.getNode().scrollToOffset({ x: 0, y: 0, animated: true });

        // this.setState({ currentPosition: segment }, () => {
        Animated.timing(this.segment_X_Translate, {
            toValue: segment,
            duration: 300
        }).start();

        this.setState({ scrollY: new Animated.Value(0) });

        this._getWalletHistory();
        // });
    };

    // Render Methods
    _renderWalletPointImage = (point, title) => {
        return (
            <View style={{ marginVertical: 8 }}>
                <ImageBackground
                    style={styles.imgHeaderRedeemPointShow}
                    resizeMode="contain"
                    source={require("../../../Resources/Images/OrderSummary/CircleWithShadow.png")}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            color: "gray",
                            fontWeight: "bold",
                            fontFamily: constant.themeFont
                        }}
                    >
                        {point}
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            // marginBottom: 2,
                            color: "gray",
                            fontFamily: constant.themeFont
                        }}
                    >
                        {title}
                    </Text>
                </ImageBackground>
            </View>
        );
    };

    _renderHeaderView = () => {
        let userRewardPoints = global.currentSettings.total_reward;
        let userRewardPointsInSAR = global.currentSettings.total_reward_sr;
        var headMov = this.state.scrollY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -0.02]
        });
        return (
            <Animated.View
                style={{
                    marginTop: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateY: headMov }]
                }}
            >
                <Text
                    style={{
                        fontFamily: constant.themeFont,
                        fontSize: 17,
                        marginBottom: 8
                    }}
                >
                    Wallet Balance
        </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 18
                    }}
                >
                    {this._renderWalletPointImage(userRewardPoints, "Points")}
                    <Text
                        style={{
                            fontFamily: constant.themeFont,
                            fontSize: 20,
                            marginHorizontal: 5
                        }}
                    >
                        =
          </Text>
                    {this._renderWalletPointImage(userRewardPointsInSAR, "SAR")}
                </View>
                <View
                    style={{
                        width: "100%",
                        height: 10,
                        backgroundColor: constant.grayShadeColorAA,
                        position: "absolute",
                        bottom: 2,
                        opacity: 0.2
                    }}
                />
                {/* {this._renderSegmentView()} */}
            </Animated.View>
        );
    };

    _renderSegmentView = () => {
        let viewWidth = Dimensions.get("window").width / 3;
        return (
            <View style={{ backgroundColor: "white" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        style={styles.segmentBtns}
                        onPress={() => this._onPressSegmentBtn(0)}
                    >
                        <Text style={styles.segmentBtnsTxt}> All </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.segmentBtns}
                        onPress={() => this._onPressSegmentBtn(1)}
                    >
                        <Text style={styles.segmentBtnsTxt}> Redeemed </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.segmentBtns}
                        onPress={() => this._onPressSegmentBtn(2)}
                    >
                        <Text style={styles.segmentBtnsTxt}> Collected </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: "100%", height: 2 }}>
                    <Animated.View
                        style={{
                            width: viewWidth,
                            height: "100%",
                            backgroundColor: constant.themeColor,
                            transform: [
                                {
                                    translateX: this.segment_X_Translate.interpolate({
                                        inputRange: [0, arrWalletType.length - 1],
                                        outputRange: [0, (arrWalletType.length - 1) * viewWidth]
                                    })
                                }
                            ]
                        }}
                    />
                </View>
                <View style={styles.seperatorView} />
            </View>
        );
    };

    _renderWalletItem = ({ item }) => {
        // constant.debugLog("wallet item" + JSON.stringify(item));
        let imgArrow =
            Number(item.point) > 0
                ? require("../../../Resources/Images/OrderSummary/DownloadArrow.png")
                : require("../../../Resources/Images/OrderSummary/UpArrow.png");
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    marginBottom: StyleSheet.hairlineWidth,
                    backgroundColor: "white",
                    justifyContent: "space-between"
                }}
            >
                <View
                    style={{
                        marginVertical: 8,
                        marginLeft: 16,
                        justifyContent: "center"
                    }}
                >
                    <Text
                        style={{
                            fontFamily: constant.themeFont,
                            color: constant.grayShadeColor55
                        }}
                    >
                        Order Id: #{item.order_id}{" "}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Image
                            style={{ height: 15, width: 15 }}
                            source="contain"
                            source={imgArrow}
                        />
                        <Text
                            style={{
                                fontFamily: constant.themeFont,
                                color: constant.grayShadeColor55,
                                marginTop: 2,
                                marginLeft: 2
                            }}
                        >
                            {moment(item.created_at, "DD-MM-YYYY hh:mm:ss A").format(
                                "DD MMM, YYYY hh:mm A"
                            )}
                        </Text>
                    </View>
                </View>
                <View style={{ marginVertical: 8 }}>
                    <ImageBackground
                        style={styles.imgRedeemPointShow}
                        resizeMode="contain"
                        source={require("../../../Resources/Images/OrderSummary/CircleWithShadow.png")}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                color: "gray",
                                fontWeight: "bold",
                                fontFamily: constant.themeFont
                            }}
                        >
                            {item.point}
                        </Text>
                    </ImageBackground>
                </View>

                <View style={styles.seperatorView} />
            </View>
        );
    };

    _renderWalletData = type => {
        switch (type) {
            case constant.kWalletTypeAll:
                this.arrShowWallet = this.props.arrWalletAllData;
                break;
            case constant.kWalletTypeRedeemed:
                this.arrShowWallet = this.props.arrWalletRedeemedData;
                break;
            case constant.kWalletTypeCollected:
                this.arrShowWallet = this.props.arrWalletCollectedData;
                break;
            default:
                break;
        }

        // constant.debugLog("SCROLL Y :====> " + this.state.scrollY);

        return (
            <View style={{ backgroundColor: "white", flex: 1 }}>
                {this.arrShowWallet.length > 0 ? (
                    <AnimatedFlatList
                        scrollEventThrottle={16}
                        // Declarative API for animations ->
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: { y: this.state.scrollY }
                                    }
                                }
                            ],
                            {
                                useNativeDriver: true,
                                listener: event => {
                                    this._changeNavigationTitle(event);
                                    // do something special
                                } // <- Native Driver used for animated events
                            }
                        )}
                        ref={flatList => {
                            this.walletList = flatList;
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isRefreshingAll}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        data={this.arrShowWallet}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this._renderWalletItem.bind(this)}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        directionalLockEnabled
                        onEndReached={this._callLoadMore}
                    // onEndReachedThreshold={0.5}
                    // ListHeaderComponent={this._renderHeaderView.bind(this)}
                    // ListFooterComponent={this._renderFooter.bind(this)}
                    />
                ) : (
                        <View />
                    )}
            </View>
        );
    };

    //Change Navigation Title From Scrolling FlatList

    _changeNavigationTitle = event => {
        console.log(this.props.navigation);
        if (event.nativeEvent.contentOffset.y > 180.0) {
            if (this.state.navigationTitleIndex == 1) {
                return;
            }
            this.setState({
                navigationTitleIndex: 1
            });
            this.props.navigation.chatList.scrollToIndex({
                animated: true,
                index: 1
            })
        } else {
            if (this.state.navigationTitleIndex == 0) {
                return;
            }
            this.setState({
                navigationTitleIndex: 0
            });
            this.props.navigation.chatList.scrollToIndex({
                animated: true,
                index: 0
            });
        }
    };

    render = () => {
        var headMov = this.state.scrollY.interpolate({
            inputRange: [0, 180, 181],
            outputRange: [0, -150, -150]
        });
        return (
            // Main View (Container)

            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ translateY: headMov }],
                            bottom: 0
                            // position: "absolute",
                        }
                    ]}
                >
                    {this._renderHeaderView()}
                    {this._renderSegmentView()}
                    <Swiper
                        //   style={styles.swipeViewWrapper}
                        ref={swiper => {
                            this._swiper = swiper;
                        }}
                        loop={false}
                        index={this.state.currentPosition}
                        onIndexChanged={index => this._onPageChange(index)}
                        onMomentumScrollEnd={(e, state, context) => { }}
                        pagingEnabled={true}
                        dotColor="transparent"
                        activeDotColor="transparent"
                    >
                        {/* ----- AddressListScreen ----- */}
                        <View style={{ flex: 1, backgroundColor: "transparent" }}>
                            {/* <Text>All</Text> */}
                            {this._renderWalletData(constant.kWalletTypeAll)}
                        </View>
                        {/* ----- SelectTimeScreen ----- */}
                        <View style={{ flex: 1, backgroundColor: "transparent" }}>
                            {this._renderWalletData(constant.kWalletTypeRedeemed)}
                        </View>
                        {/* ----- OrderSummaryScreen ----- */}
                        <View style={{ flex: 1, backgroundColor: "transparent" }}>
                            {this._renderWalletData(constant.kWalletTypeCollected)}
                        </View>
                    </Swiper>

                    {/* // Loader */}
                    {/* <Spinner visible={this.props.isLoading} /> */}
                </Animated.View>
            </View>
        );
    };
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.wallet.isLoading,
        isRefreshingAll: state.wallet.isRefreshingAll,
        isWalletSuccess: state.wallet.isWalletSuccess,
        currentPage: state.wallet.currentPage,
        currentSelectedType: state.wallet.currentSelectedType,
        lastPage: state.wallet.lastPage,
        arrWalletAllData: state.wallet.arrWalletAllData,
        arrWalletRedeemedData: state.wallet.arrWalletRedeemedData,
        arrWalletCollectedData: state.wallet.arrWalletCollectedData,
        error: state.wallet.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getWalletHistory: parameters =>
            dispatch({
                type: constant.actions.getWalletHistoryRequest,
                payload: { endPoint: constant.APIGetRewardHistory, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WalletScreen);
