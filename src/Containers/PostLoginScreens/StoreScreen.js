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
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Picker,
    AsyncStorage,
} from "react-native";

// Constants
import * as constant from "../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../AppRedux/Actions/actions";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

// Localization
import baseLocal from "../../Resources/Localization/baseLocalization";

// Common Utilities
import * as CommonUtilities from "../../Helper/CommonUtilities";

var selectedCity = null;
var selectedArea = null;
class StoreScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.onPressOK = this.onPressOK.bind(this);
        this.onPressBack = this.onPressBack.bind(this);
        this.onChangeStore = this.onChangeStore.bind(this);

        this.state = {
            // arrStores: [],
            selectedStoreName: "",
            selectedStoreIndex: -1,
        };
    }

    componentWillMount() {
        selectedCity = this.props.navigation.getParam("selectedCity", "");
        selectedArea = this.props.navigation.getParam("selectedArea", "");
        var storeParameters = {
            cityId: selectedCity.PkId,
            areaId: selectedArea.PkId,
        };
        this.props.getStores(storeParameters);

        /*
        let selectedCityTemp = this.props.navigation.getParam("selectedCity", "noCity");
        let selectedAreaTemp = this.props.navigation.getParam("selectedArea", "noArea");
        if (selectedCityTemp != "noCity" && selectedAreaTemp != "noArea") {
            this.setState(
                {
                    selectedCity: selectedCityTemp,
                    selectedArea: selectedAreaTemp,
                },
                () => {
                    var storeParameters = {
                        cityId: this.state.selectedCity.PkId,
                        areaId: this.state.selectedArea.PkId,
                    };

                    // Show Loading View
                    this.setState({ visible: true });
                    networkUtility.getRequest(constant.APIGetStore, storeParameters).then(
                        result => {
                            // Hide Loading View
                            this.setState({ visible: false });

                            this.setState({
                                selectedStoreName: result.data.data.length > 0 ? result.data.data[0].storeName : "",
                                selectedStoreIndex: result.data.data.length > 0 ? 0 : -1,
                                arrStores: result.data.data,
                            });
                            // HTTP Status Code => {result.status}
                        },
                        error => {
                            // Hide Loading View
                            this.setState({ visible: false });

                            constant.debugLog("Status Code: " + error.status);
                            constant.debugLog("Error Message: " + error.message);
                            if (error.status != 500) {
                                if (
                                    global.currentAppLanguage === constant.languageArabic &&
                                    error.data["messageAr"] != undefined
                                ) {
                                    CommonUtilities.showAlert(error.data["messageAr"], false);
                                } else {
                                    CommonUtilities.showAlert(error.data["message"], false);
                                }
                            } else {
                                constant.debugLog("Internal Server Error: " + error.data);
                                CommonUtilities.showAlert("Opps! something went wrong");
                            }
                        }
                    );
                }
            );
        }
        */
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isGetStoreSuccess === true && newProps.arrStores.length > 0) {
            this.setState({
                selectedStoreName: newProps.arrStores[0].storeName,
                selectedStoreIndex: 0,
            });
        } else if (newProps.isSetStoreSuccess === true && newProps.arrStores.length > 0) {
            AsyncStorage.setItem(
                constant.keyCurrentStore,
                JSON.stringify(this.props.arrStores[this.state.selectedStoreIndex])
            ).then(() => {
                AsyncStorage.getItem(constant.keyCurrentStore).then(val => {
                    global.currentStore = JSON.parse(val);
                    constant.emitter.emit(constant.setStoreListener);
                });
            });
        }
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressOK() {
        var setStoreParameters = {
            _method: "put",
            storeId: this.props.arrStores[this.state.selectedStoreIndex].storeId,
        };

        this.props.setStores(setStoreParameters);

        /*
        networkUtility.postRequest(constant.APISetStore, setStoreParameters).then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });
                AsyncStorage.setItem(
                    constant.keyCurrentStore,
                    JSON.stringify(this.state.arrStores[this.state.selectedStoreIndex])
                ).then(() => {
                    AsyncStorage.getItem(constant.keyCurrentStore).then(val => {
                        global.currentStore = this.state.arrStores[this.state.selectedStoreIndex];
                        AsyncStorage.setItem(constant.isLogin, "true");
                        constant.emitter.emit(constant.loginListener);
                    });
                });
            },
            error => {
                // Show Loading View
                this.setState({ visible: false });

                constant.debugLog("\nStatus Code: " + error.status);
                constant.debugLog("\nError Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        CommonUtilities.showAlert(error.data["message"], false);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
            }
        );
        */
    }

    onChangeStore(newStore, newIndex) {
        constant.debugLog("Selected Store Index: " + newIndex + ". Store Name: " + newStore);
        this.setState({
            selectedStoreName: newStore,
            selectedStoreIndex: newIndex,
        });
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { errors = {}, secureTextEntry, email, password } = this.state;
        let storeItems = this.props.arrStores.map((value, index) => {
            let storeNameTemp = global.currentAppLanguage === "en" ? value.storeName : value.storeNameAr;
            return <Picker.Item key={index} value={storeNameTemp} label={storeNameTemp} />;
        });

        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner
                    visible={this.props.isLoading}
                    cancelable={true}
                    // textContent={"Please wait..."}
                    textStyle={{ color: "#FFF" }}
                />
                {/* // Selected Store Value Text */}
                <Text
                    style={{
                        fontFamily: "Ebrima",
                        fontSize: 37,
                        color: "white",
                        marginTop: 10,
                    }}
                >
                    {selectedArea != null
                        ? global.currentAppLanguage === "en"
                            ? selectedArea.areaName
                            : selectedArea.areaNameAr
                        : ""}
                </Text>
                {/* // Select Store Text */}
                <Text
                    style={{
                        fontFamily: "Ebrima",
                        fontSize: 20,
                        color: "white",
                        marginTop: 10,
                    }}
                >
                    {baseLocal.t("SELECT STORE")}
                </Text>

                <Picker
                    selectedValue={this.state.selectedStoreName === undefined ? "" : this.state.selectedStoreName}
                    style={{ height: 100, width: 200 }}
                    onValueChange={this.onChangeStore}
                    itemStyle={{ color: "white", fontFamily: "Ebrima", fontSize: 20 }}
                >
                    {storeItems}
                </Picker>
                {/* // Back and Reset Buttons View */}
                <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-around", marginTop: 100 }}>
                    {/* // Back Button */}
                    <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressBack}>
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                            {baseLocal.t("Back")}
                        </Text>
                    </TouchableOpacity>

                    {/* // Sign Up Button */}
                    <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressOK}>
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>
                            {baseLocal.t("OK")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.store.isLoading,
        isGetStoreSuccess: state.store.isGetStoreSuccess,
        isSetStoreSuccess: state.store.isSetStoreSuccess,
        arrStores: state.store.arrStores,
        error: state.store.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getStores: parameters =>
            dispatch({
                type: constant.actions.getStoreRequest,
                payload: { endPoint: constant.APIGetStore, parameters: parameters },
            }),
        setStores: parameters =>
            dispatch({
                type: constant.actions.setStoreRequest,
                payload: { endPoint: constant.APISetStore, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CF2526",
    },
    signUpButtonStyle: {
        width: "35%",
        marginTop: 20,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderColor: "white",
        borderWidth: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
});
