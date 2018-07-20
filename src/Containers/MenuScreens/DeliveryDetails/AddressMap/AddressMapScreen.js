/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, TextInput, View, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import { connect } from "react-redux"; // Redux
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization

let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 26.2361;
const LONGITUDE = 50.0393;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class AddressMapScreen extends Component {
    constructor(props) {
        super(props);

        const mapPinDownImage = require("../../../../Resources/Images/DeliveryDetails/LocationMapPinDown.png");
        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            mapPinImage: mapPinDownImage,
            searchText: "",
        };
    }

    static navigationOptions = CommonUtilities.navigationView(baseLocal.t("Address Map"), true);

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                });
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition(position => {
            this.setState({
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                },
            });
        });
    };

    _setMapPinImage = (isRegionChangeDomplete = false) => {
        if (isRegionChangeDomplete === true) {
            this.setState({
                mapPinImage: require("../../../../Resources/Images/DeliveryDetails/LocationMapPinDown.png"),
            });
        } else {
            this.setState({
                mapPinImage: require("../../../../Resources/Images/DeliveryDetails/LocationMapPinUp.png"),
            });
        }
    };

    _getInitialState = () => {
        let region = {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        return region;
    };

    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchID);
    };

    componentWillReceiveProps = newProps => {};

    _onRegionChange = region => {
        constant.debugLog("Region Change");
        this.setState({ region });
        this._setMapPinImage();
    };

    _onRegionChangeComplete = region => {
        constant.debugLog("Region Change Complete");
        this.setState({ region });
        this._setMapPinImage(true);
    };

    _renderSearchResultItem = item => {
        return (
            <View style={styles.searchResultListItem}>
                <Text> Address </Text>
                <View style={styles.searchResultListItemSeparator}/>
            </View>
        );
    };

    _renderSearchResult = () => {
        <FlatList
            style={styles.searchResultList}
            ref={flatList => {
                this.arrAddress = flatList;
            }}
            data={this.props.arrAddress}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderAddressItem}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            directionalLockEnabled
            onEndReached={this._callLoadMore}
            onEndReachedThreshold={0.7}
        />;
    };

    render = () => {
        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} />
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: "100%", height: "100%" }}
                    showsUserLocation={true}
                    initialRegion={this._getInitialState()}
                    onRegionChange={this._onRegionChange}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                />
                <View style={styles.searchTextView}>
                    <TextInput
                        ref={this.searchTextRef}
                        placeholder={baseLocal.t("Address")}
                        onChangeText={searchText => this.setState({ searchText })}
                        value={this.state.searchText}
                        style={{ width: "95%" }}
                    />
                </View>
                <Image style={styles.mapPinImage} source={this.state.mapPinImage} />
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
        onLogin: parameters =>
            dispatch({
                type: constant.actions.loginRequest,
                payload: { endPoint: constant.APILogin, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressMapScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
    mapPinImage: {
        position: "absolute",
        top: Dimensions.get("window").height / 2 - 80,
        justifyContent: "center",
        alignItems: "center",
    },
    searchTextView: {
        position: "absolute",
        top: 65,
        height: 30,
        width: "85%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: constant.darkGrayBGColor,
        backgroundColor: "white",
    },
    searchResultList: {
        position: "absolute",
        top: 95,
        height: 150,
        width: "85%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: constant.darkGrayBGColor,
        backgroundColor: "white",
    },
    searchResultListItem: {
        width: "95%",
    },
    searchResultListItemSeparator: {
        width: "100%",
        height: 1,
        backgroundColor: constant.darkGrayBGColor,
    },
});
