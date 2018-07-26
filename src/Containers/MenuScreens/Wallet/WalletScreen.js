/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux"; // Redux
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import Swiper from "react-native-swiper";

import * as constant from "../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../Helper/NetworkUtility"; // Network Utility
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization
import styles from "./WalletStyle";

const filterAll = "all";
const filterPaid = "paid";
const filterReceived = "received";

class WalletScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            filterType: filterAll,
            currentPosition: 0,
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Location"), true);

    componentDidMount = () => {
        this._getWalletHistory()
    };

    componentWillReceiveProps = newProps => {};

    _getWalletHistory = (isRefresh = false, isLoadMore = false) => {
        let orderHistoryPage = 1;
        if (!isRefresh && isLoadMore && this.props.currentPage < this.props.lastPage) {
            orderHistoryPage = this.props.currentPage + 1;
        }

        var orderHistoryParameters = {
            page: orderHistoryPage,
        };

        this.props.getWalletHistory(orderHistoryParameters);
    };

    _renderWalletData = type => {};

    render = () => {
        return (
            // Main View (Container)
            <View style={styles.container}>
                <Swiper
                    //   style={styles.swipeViewWrapper}
                    ref={swiper => {
                        this._swiper = swiper;
                    }}
                    loop={false}
                    index={this.state.currentPosition}
                    onIndexChanged={index => this._onPageChange(index)}
                    onMomentumScrollEnd={(e, state, context) => {}}
                    pagingEnabled={true}
                >
                    {/* ----- AddressListScreen ----- */}
                    <View style={styles.addressListContainerStyle}>
                        <AddressListScreen parentScreen={this} />
                    </View>

                    {this.props.parentScreen.isScheduleOrder != undefined &&
                    this.props.parentScreen.isScheduleOrder === true ? (
                        // {/* ----- SelectTimeScreen ----- */}
                        <View style={styles.orderTimeSlotContainerStyle}>
                            <CalendarScreen parentScreen={this} />
                        </View>
                    ) : (
                        // {/* ----- SelectTimeScreen ----- */}
                        <View style={styles.orderTimeSlotContainerStyle}>
                            <SelectTimeScreen parentScreen={this} />
                        </View>
                    )}

                    {/* ----- OrderSummaryScreen ----- */}
                    <View style={styles.paymentContainerStyle}>
                        <OrderSummaryScreen
                            parentScreen={this}
                            // updateRedeemPoint={points => this._updateRedeemPoint(points)}
                        />
                    </View>
                </Swiper>
            </View>
        );
    };
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.login.isLoading,
        isSuccess: state.login.isSuccess,
        result: state.login.result,
        error: state.login.error,
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
