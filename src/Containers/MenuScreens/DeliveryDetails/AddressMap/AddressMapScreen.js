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

    componentWillReceiveProps = newProps => {
        // if(newProps.isAutoCompleteSuccess === true){
        //     if(newProps.result === undefined){
        //         constant.debugLog("Request Invalid")
        //     }else{
        //     }
        // }else if(newProps.isPlaceDetailSuccess === true){
        //     if(newProps.result === undefined){
        //         constant.debugLog("Request Invalid")
        //     }else{
        //     }
        // }else if(newProps.isGeoCodeSuccess === true){
        //     if(newProps.result === undefined){
        //         constant.debugLog("Request Invalid")
        //     }else{
        //     }
        // }
    };

    _onRegionChange = region => {
        // constant.debugLog("Region Change");
        // this.setState({ region });
        this.setState(...this.state, {region});
        this._setMapPinImage();
    };

    _onRegionChangeComplete = region => {
        // constant.debugLog("Region Change Complete");
        this.setState({ region });
        this._setMapPinImage(true);
    };

    _onChangeSearchText = searchText => {
        this.setState({ searchText });
        let placeAutoCompleteParameters = {
            input: searchText,
            key: constant.GoogleMapAPIKey,
        };
        this.props.dispatchPlaceAutoComplete(placeAutoCompleteParameters);
    };

    _onPressAddress = item => {

    }

    _renderSearchResultItem = item => {
        return (
            <TouchableOpacity style={styles.searchResultListItem} onPress={() => this._onPressAddress(item.item)}>
                <Text style={styles.searchResultListItemText}> {item.item.description} </Text>
                <View style={styles.searchResultListItemSeparator} />
            </TouchableOpacity>
        );
    };

    _renderSearchResult = () => {
        // constant.debugLog("Reached Here")
        return this.props.addressMap.resultAutoComplete.length > 0 ? (
            <FlatList
                style={styles.searchResultList}
                ref={flatList => {
                    this.arrAddress = flatList;
                }}
                data={this.props.addressMap.resultAutoComplete}
                keyExtractor={(item, index) => item.id}
                renderItem={this._renderSearchResultItem}
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={false}
                directionalLockEnabled
            />
        ) : null;
    };

    render = () => {
        return (
            // Main View (Container)
            <View style={styles.container}>
                {/* <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} /> */}
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: "100%", height: "100%" }}
                    // region={this.state.region}
                    showsUserLocation={true}
                    initialRegion={this._getInitialState()}
                    onRegionChange={this._onRegionChange}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                />
                <View style={styles.searchTextView}>
                    <TextInput
                        ref={this.searchTextRef}
                        placeholder={baseLocal.t("Address")}
                        onChangeText={this._onChangeSearchText}
                        value={this.state.searchText}
                        style={{ width: "95%" }}
                    />
                </View>
                {this._renderSearchResult()}
                <Image style={styles.mapPinImage} source={this.state.mapPinImage} />
            </View>
        );
    };
}

function mapStateToProps(state, props) {
    return {
        addressMap: state.addressMap,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchPlaceAutoComplete: parameters =>
            dispatch({
                type: constant.actions.placeAutocompleteRequest,
                payload: { url: constant.APIPlaceAutoComplete, endPoint: "json", parameters: parameters },
            }),
        dispatchPlaceDetail: parameters =>
            dispatch({
                type: constant.actions.placeDetailRequest,
                payload: { url: constant.APIPlaceDetail, endPoint: "json", parameters: parameters },
            }),
        dispatchGeoCode: parameters =>
            dispatch({
                type: constant.actions.geoCodeRequest,
                payload: { url: constant.APIGeoCode, endPoint: "json", parameters: parameters },
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
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: 1,
        borderColor: constant.darkGrayBGColor,
        backgroundColor: "white",
    },
    searchResultList: {
        position: "absolute",
        top: 94,
        height: 150,
        width: "85%",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: constant.darkGrayBGColor,
        backgroundColor: "white",
    },
    searchResultListItem: {
        width: "100%",
        height: 50,
    },
    searchResultListItemText: {
        fontFamily: constant.themeFont,
        fontSize: 14,
        marginTop: 15,
        marginLeft: 5,
    },
    searchResultListItemSeparator: {
        width: "100%",
        height: 1,
        backgroundColor: constant.darkGrayBGColor,
        marginTop: 15,
    },
});
