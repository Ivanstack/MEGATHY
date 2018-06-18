/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Picker } from "react-native";

// Constants
import constant from "../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../AppRedux/Actions/actions";

// Network Utility
import * as networkUtility from "../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";

class CityScreen extends Component {
    constructor(props) {
        super(props);

        this.onPressOK = this.onPressOK.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);

        this.state = {
            arrCities: [],
            selectedCityName: "",
            selectedCityIndex: -1,
            visible: false,
        };
    }

    componentWillMount() {
        // Show Loading View
        this.setState({ visible: true });
        networkUtility.getRequest(constant.getCity, "").then(
            result => {
                // Hide Loading View
                this.setState({ visible: false });

                this.setState({
                    selectedCityName: result.data.data.length > 0 ? result.data.data[0].cityName : "",
                    selectedCityIndex: result.data.data.length > 0 ? 0 : -1,
                    arrCities: result.data.data,
                });
            },
            error => {
                // Hide Loading View
                this.setState({ visible: false });

                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage != "en" && error.data["messageAr"] != undefined) {
                        alert(error.data["messageAr"]);
                    } else {
                        setTimeout(() => {
                            alert(error.data["message"]);
                        }, 200);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    alert("Something went wrong, plese try again");
                }
            }
        );
    }

    onPressOK() {
        this.props.navigation.navigate("AreaScreen", {
            selectedCity: this.state.arrCities[this.state.selectedCityIndex],
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
        let cityItems = this.state.arrCities.map((value, index) => {
            return <Picker.Item key={index} value={value.cityName} label={value.cityName} />;
        });

        return (
            // Main View (Container)
            <View style={styles.container}>
                <Spinner
                    visible={this.state.visible}
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
                    SELECT CITY
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
                            OK
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        login: state.dataReducer.login,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
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
