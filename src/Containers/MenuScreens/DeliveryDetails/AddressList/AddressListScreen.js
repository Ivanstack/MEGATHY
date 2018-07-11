/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import {
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    FlatList,
    RefreshControl,
    Alert,
} from "react-native";

import * as constant from "../../../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// AddressListItem
import AddressListItem from "./AddressListItem";

class AddressListScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reloadPage: false,
        };
        baseLocal.locale = global.currentAppLanguage;
        this._onRefresh = this._onRefresh.bind(this);
        this._callLoadMore = this._callLoadMore.bind(this);
        this._getAddressList = this._getAddressList.bind(this);
        this._onDeleteAddress = this._onDeleteAddress.bind(this);
        this._onPressItem = this._onPressItem.bind(this);
        this._onPressAddAddress = this._onPressAddAddress.bind(this);
        this._onPressEditItem = this._onPressEditItem.bind(this);
        this._onPressDeleteItem = this._onPressDeleteItem.bind(this);
        this._onPressDeliverItem = this._onPressDeliverItem.bind(this);
    }

    static navigationOptions = CommonUtilities.navigationView("Address List");

    _keyExtractor = (item, index) => item.id.toString();

    componentDidMount() {
        this._getAddressList(true);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isGetSuccess === true && newProps.arrAddress.length) {
            if (this.props.parentScreen != undefined) {
                this.props.parentScreen.selectedAddress = newProps.arrAddress[0];
            }
        }

        if (newProps.isDeleteSuccess === true) {
            this._onRefresh();
        }
    }

    _callLoadMore() {
        if (this.props.currentPage < this.props.lastPage) {
            this._getAddressList(false, true);
        }
    }

    _onRefresh() {
        this.props.currentPage = 1;
        this._getAddressList(true);
    }

    _getAddressList(isRefresh = false, isLoadMore = false) {
        let addressPage = this.props.currentPage;
        if (!isRefresh && isLoadMore && this.props.currentPage < this.lastPage) {
            addressPage = addressPage + 1;
        }
        this.props.dispatchGetAddress({ page: addressPage });
    }

    _onPressAddAddress() {
        this.props.navigation.navigate("AddAddressScreen");
    }

    _renderAddressItem = ({ item }) => (
        <AddressListItem
            address={item}
            parentEntryPoint={this.props.parentScreen}
            onPressItem={this._onPressItem}
            onPressEditItem={this._onPressEditItem}
            onPressDeleteItem={this._onPressDeleteItem}
            onPressDeliverItem={this._onPressDeliverItem}
        />
    );

    _onPressItem(address) {
        let arrAddressTemp = this.props.arrAddress;
        this.props.arrAddress.map((addressTemp, index, arrObjects) => {
            if (addressTemp.id === address.id) {
                addressTemp.selected = true;
            } else if (addressTemp.selected != undefined) {
                delete addressTemp.selected;
            }
        });

        if (this.props.parentScreen != undefined) {
            this.props.parentScreen.selectedAddress = address;
        }
        this.setState({ reloadPage: !this.state.reloadPage });

        constant.emitter.emit(constant.reloadOrderMasterListener);
    }

    _onPressEditItem(address) {}

    _onPressDeleteItem(address) {
        CommonUtilities.showAlertYesNo("Are you sure you want to delete this address?").then(
            pressedYes => {
                constant.debugLog("User pressed Yes");
                this._onDeleteAddress(address);
            },
            pressedNo => {
                constant.debugLog("User pressed No");
            }
        );
    }

    _onPressDeliverItem(address) {}

    _onDeleteAddress(address) {
        this.props.dispatchDeleteAddress(address.id);
    }

    render() {
        return (
            // Main View (Container)
            <View style={{ flex: 1 }}>
                {/* <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} /> */}
                <SafeAreaView style={styles.container}>
                    {/* // Address List */}
                    {this.props.arrAddress.length > 0 ? (
                        <FlatList
                            style={{
                                marginTop: 8,
                                width: "95%",
                                height: "89%",
                            }}
                            ref={flatList => {
                                this.arrAddress = flatList;
                            }}
                            refreshControl={
                                <RefreshControl refreshing={this.props.isRefreshing} onRefresh={this._onRefresh} />
                            }
                            data={this.props.arrAddress}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderAddressItem}
                            showsHorizontalScrollIndicator={false}
                            removeClippedSubviews={false}
                            directionalLockEnabled
                            onEndReached={this._callLoadMore}
                            onEndReachedThreshold={0.7}
                        />
                    ) : (
                        <View style={{ marginTop: 8, width: "95%", height: "89%" }} />
                    )}

                    {/* // Add New Address Button */}
                    <TouchableOpacity style={styles.loginButtonStyle} onPress={this._onPressAddAddress}>
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "Ebrima",
                                fontWeight: "bold",
                            }}
                        >
                            {baseLocal.t("Add New Address")}
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isRefreshing: state.addressList.isRefreshing,
        isLoading: state.addressList.isLoading,
        isGetSuccess: state.addressList.isGetSuccess,
        isDeleteSuccess: state.addressList.isDeleteSuccess,
        arrAddress: state.addressList.arrAddress,
        currentPage: state.addressList.currentPage,
        lastPage: state.addressList.lastPage,
        error: state.addressList.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchGetAddress: parameters =>
            dispatch({
                type: constant.actions.getAddressRequest,
                payload: { endPoint: constant.APIGetAddress, parameters: parameters },
            }),
        dispatchDeleteAddress: addressId =>
            dispatch({
                type: constant.actions.deleteAddressRequest,
                payload: { endPoint: constant.APIDeleteAddress + "/" + addressId, parameters: "" },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressListScreen);

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#CF2526",
    },
    loginButtonStyle: {
        width: "95%",
        marginTop: 8,
        backgroundColor: constant.themeColor,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        // borderRadius: 20,
    },
    headerText: {
        color: "white",
        margin: 4,
        // marginLeft: 5,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
});
