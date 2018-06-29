/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Picker } from "react-native";

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

class CityScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.onPressOK = this.onPressOK.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);

        this.state = {
            selectedCityName: "",
            selectedCityIndex: -1,
        };
    }

    componentWillMount() {
        this.props.getCities();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isSuccess === true && newProps.arrCities.length > 0) {
            this.setState({
                selectedCityName: newProps.arrCities[0].cityName,
                selectedCityIndex: 0,
            });
        }
    }

    onPressOK() {
        this.props.navigation.navigate("AreaScreen", {
            selectedCity: this.props.arrCities[this.state.selectedCityIndex],
        });
    }

    onChangeCity(newCity, newIndex) {
        constant.debugLog("Selected City Index: " + newIndex + ". City Name: " + newCity);
        this.setState({
            selectedCityName: newCity,
            selectedCityIndex: newIndex,
        });
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { errors = {}, secureTextEntry, email, password } = this.state;
        let cityItems = this.props.arrCities.map((value, index) => {
            let cityNameTemp = global.currentAppLanguage === "en" ? value.cityName : value.cityNameAr;
            return <Picker.Item key={index} value={cityNameTemp} label={cityNameTemp} />;
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
                {/* // Select City Text */}
                <Text
                    style={{
                        fontFamily: "Ebrima",
                        fontSize: 30,
                        color: "white",
                        marginTop: 10,
                    }}
                >
                    {baseLocal.t("SELECT CITY")}
                </Text>

                <Picker
                    selectedValue={this.state.selectedCityName === undefined ? "" : this.state.selectedCityName}
                    style={{ height: 100, width: 200 }}
                    onValueChange={this.onChangeCity}
                    itemStyle={{ color: "white", fontFamily: "Ebrima", fontSize: 20 }}
                >
                    {cityItems}
                </Picker>
                {/* // Back and Reset Buttons View */}
                <View style={{ width: "80%", marginTop: 140, alignItems: "center" }}>
                    {/* // Reset Button */}
                    <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressOK}>
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontSize: 14, fontWeight: "bold" }}>
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
        isLoading: state.city.isLoading,
        isSuccess: state.city.isSuccess,
        arrCities: state.city.arrCities,
        error: state.city.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCities: () =>
            dispatch({
                type: constant.actions.getCityRequest,
                payload: { endPoint: constant.APIGetCity, parameters: "" },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CityScreen);

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
        // backgroundColor: "#99050D",
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
