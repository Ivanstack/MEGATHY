/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform } from "react-native";
import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    Image,
} from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import moment from "moment"; // Date/Time Conversition
import ActionSheet from "react-native-actionsheet";

// Styles
import styles from "./ScheduleOrderListStyle";

var selectedOrderId = 0;
class ScheduleOrderListScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            currentPage: 1,
            lastPage: 1,
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Scheduled Order History"), false);

    componentDidMount() {
        this._getOrderHistory();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.scheduleOrderList.isCancelOrderSuccess === true) {
            this._onRefresh();
        }
    }

    // Mics Methods

    _getOrderHistory = (isRefresh = false, isLoadMore = false) => {
        let page = 1;
        if (
            !isRefresh &&
            isLoadMore &&
            this.props.scheduleOrderList.currentPage < this.props.scheduleOrderList.lastPage
        ) {
            page = this.props.scheduleOrderList.currentPage + 1;
        }

        var parameters = {
            page: page,
        };

        this.props.getOrderHistory(parameters);
    };

    _onRefresh() {
        this._getOrderHistory(true);
        constant.debugLog("On Refresh call....");
    }

    _callLoadMore() {
        console.log("Call Load More .....");

        if (this.props.scheduleOrderList.currentPage < this.props.scheduleOrderList.lastPage) {
            this._getOrderHistory(false, true);
        }
    }

    // OnPress Methods
    _showActionSheet = () => {
        this.ActionSheet.show();
    };

    _onPressActionSheetIndex = index => {
        if (index === 0) {
            // Cancel Order
            CommonUtilities.showAlertYesNo("Are you sure want to cancel this order?").then(
                pressedYes => {
                    // User pressed Yes
                    let cancelOrderParameters = {
                        scheduleOrderId: selectedOrderId,
                        status: "Deleted",
                    };

                    this.props.updateScheduleOrderStatus(cancelOrderParameters);
                },
                pressedNo => {} // User pressed No
            );
        } else if (index === 1) {
            // Cancel
        }
    };

    _onPressOrderItem = item => {
        if (item.paymentMode === constant.kPaymentModeCash) {
            selectedOrderId = item.scheduleOrderId;
            this._showActionSheet();
        } else {
            CommonUtilities.showAlert("Oops! you cannot cancel order whose payment mode is not cash", false);
        }
    };

    // Render Methods

    _renderScheduleDateTime = orderTimeSessionMeta => {
        let dateTimeTexts = [];

        orderTimeSessionMeta.map((orderTimeSession, index) => {
            let dateTime = moment(orderTimeSession.date + " " + orderTimeSession.time).format("DD-MM-YYYY hh:mm A");
            let cartAmount = constant.currency + " " + orderTimeSession.cartAmount;
            let finalAmount = constant.currency + " " + orderTimeSession.finalAmount;
            let percentage = orderTimeSession.discountHike;

            dateTimeTexts.push(
                <View key={index}>
                    <Text style={[styles.normalTitleText, { marginLeft: 8 }]}>{dateTime}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={[
                                styles.amountText,
                                { textDecorationLine: orderTimeSession.couponActive ? "line-through" : "none" },
                            ]}
                        >
                            {orderTimeSession.couponActive ? "  " + cartAmount + " " : "  "}
                        </Text>
                        <Text style={styles.amountText}>{finalAmount}</Text>
                        <Text style={styles.amountText}>
                            {orderTimeSession.discountType === "percentage" ? " (" + percentage + "%" + ")" : ""}
                        </Text>
                    </View>
                </View>
            );
        });

        return dateTimeTexts;
    };

    _renderDateTimeView = orderTimeSessionMeta => {
        return (
            <View style={{ margin: 4, flexDirection: "row", marginTop: 8 }}>
                <Image
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    source={require("../../../../Resources/Images/Order/TimeIcon.png")}
                    resizeMode="contain"
                />
                <View>{this._renderScheduleDateTime(orderTimeSessionMeta)}</View>
            </View>
        );
    };

    _renderAddressView = address => {
        return (
            <View style={{ margin: 4, flexDirection: "row", marginTop: 8 }}>
                <Image
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    source={require("../../../../Resources/Images/Order/LocationIcon.png")}
                    resizeMode="contain"
                />
                <Text style={[styles.normalTitleText, { marginLeft: 8, width: "90%" }]}>{address}</Text>
            </View>
        );
    };

    _renderDateAndAddressView = (title, isAddress) => {
        let imgSource = isAddress
            ? require("../../../../Resources/Images/Order/LocationIcon.png")
            : require("../../../../Resources/Images/Order/TimeIcon.png");
        return (
            <View style={{ margin: 4, flexDirection: "row", marginTop: 8 }}>
                <Image style={{ width: 20, height: 20, marginRight: 8 }} source={imgSource} resizeMode="contain" />
                <Text style={[styles.normalTitleText, { marginLeft: 8 }]}>{title}</Text>
            </View>
        );
    };

    _renderOrderHistoryItem = ({ item, index }) => {
        let orderStatus =
            item.status === constant.kOrderStatusDelivered
                ? constant.kOrderStatusDeliveredStat
                : constant.kOrderStatusInProcess;
        let orderStatusColor = item.status === constant.kOrderStatusDelivered ? constant.themeGreenColor : "gray";
        // constant.debugLog("order Status : " + orderStatus);
        return (
            <TouchableWithoutFeedback
                style={{ backgroundColor: constant.prodCategoryBGColor }}
                onPress={() => this._onPressOrderItem(item)}
            >
                <View style={styles.orderHistoryItemConstainerStyle}>
                    <View style={{ flex: 1, margin: 8, marginRight: 0 }}>
                        <Text style={[styles.boldTitleText, { marginLeft: 36 }]}>
                            Order Id: {item.displayScheduleOrderId}
                        </Text>
                        {this._renderDateTimeView(item.order_time_session_meta)}
                        {this._renderAddressView(item.address_meta.address)}
                        {/* {this._renderDateAndAddressView(item.address_meta.address, true)} */}
                        <Text style={[styles.normalTitleText, , { marginLeft: 36, marginTop: 4 }]}>
                            Payment Mode: {item.paymentMode}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginLeft: 36,
                                marginTop: 4,
                            }}
                        >
                            <Text style={[styles.boldTitleText, { color: constant.themeColor, marginTop: 4 }]}>
                                SAR: {item.orderTotal}
                            </Text>
                            {/* <View
                                style={[styles.orderStatusViewStyle, { backgroundColor: orderStatusColor }]}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 12,
                                        fontWeight: "bold",
                                        fontFamily: constant.themeFont,
                                    }}
                                >
                                    {orderStatus}
                                </Text>
                            </View> */}
                        </View>
                    </View>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: 22, height: 22 }}
                            source={require("../../../../Resources/Images/Order/RightAero.png")}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        return (
            // Main View (Container)
            <View>
                <SafeAreaView style={[styles.mainContainer, { backgroundColor: constant.darkGrayBGColor }]}>
                    <ActionSheet
                        ref={o => (this.ActionSheet = o)}
                        title={baseLocal.t("Scheduled Order Options")}
                        options={[baseLocal.t("Cancel Order"), baseLocal.t("Cancel")]}
                        cancelButtonIndex={1}
                        destructiveButtonIndex={0}
                        onPress={this._onPressActionSheetIndex}
                    />
                    {this.props.scheduleOrderList.arrScheduleOrderHistory.length > 0 ? (
                        <FlatList
                            style={{
                                width: "95%",
                                // height: "100%",
                                backgroundColor: "transparent",
                            }}
                            ref={flatList => {
                                this.orderHistoryList = flatList;
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.props.scheduleOrderList.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            data={this.props.scheduleOrderList.arrScheduleOrderHistory}
                            keyExtractor={(item, index) => item.scheduleOrderId.toString()}
                            renderItem={this._renderOrderHistoryItem.bind(this)}
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={false}
                            directionalLockEnabled
                            onEndReached={this._callLoadMore.bind(this)}
                            onEndReachedThreshold={0.5}
                            // ListFooterComponent={this._renderFooter.bind(this)}
                        />
                    ) : (
                        <Spinner
                            visible={this.props.scheduleOrderList.isLoading}
                            cancelable={true}
                            textStyle={{ color: "#FFF" }}
                        />
                    )}
                </SafeAreaView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        scheduleOrderList: state.scheduleOrderList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderHistory: parameters =>
            dispatch({
                type: constant.actions.getScheduleOrderListRequest,
                payload: { endPoint: constant.APIGetScheduleOrderHistory, parameters: parameters },
            }),
        updateScheduleOrderStatus: parameters =>
            dispatch({
                type: constant.actions.updateScheduleOrderStatusRequest,
                payload: { endPoint: constant.APIUpdateScheduleOrderStatus, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduleOrderListScreen);
