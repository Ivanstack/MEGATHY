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

class AreaScreen extends Component {
    constructor(props) {
        super(props);

        this.onPressOK = this.onPressOK.bind(this);
        this.onPressBack = this.onPressBack.bind(this);
        this.onChangeArea = this.onChangeArea.bind(this);

        this.state = {
            arrAreas: [],
            selectedAreaName: "",
            selectedAreaIndex: -1,
            visible: false,
            selectedCity: null,
        };
    }

    componentWillMount() {
        let selectedCityTemp = this.props.navigation.getParam("selectedCity", "noCity");
        if (selectedCityTemp != "noCity") {
            this.setState(
                {
                    selectedCity: selectedCityTemp,
                },
                () => {
                    var areaParameters = {
                        cityId: this.state.selectedCity.PkId,
                    };

                    // Show Loading View
                    this.setState({ visible: true });
                    networkUtility.getRequest(constant.getArea, areaParameters).then(
                        result => {
                            // Hide Loading View
                            this.setState({ visible: false });

                            this.setState({
                                selectedAreaName: result.data.data.length > 0 ? result.data.data[0].areaName : "",
                                selectedAreaIndex: result.data.data.length > 0 ? 0 : -1,
                                arrAreas: result.data.data,
                            });
                            // HTTP Status Code => {result.status}
                        },
                        error => {
                            // Hide Loading View
                            this.setState({ visible: false });

                            constant.debugLog("Status Code: " + error.status);
                            constant.debugLog("Error Message: " + error.message);
                            if (error.status != 500) {
                                if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
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
            );
        }
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressOK() {
        this.props.navigation.navigate("StoreScreen", {
            selectedCity: this.state.selectedCity,
            selectedArea: this.state.arrAreas[this.state.selectedAreaIndex],
        });
    }

    onChangeArea(newArea, newIndex) {
        constant.debugLog("Selected Area Index: " + newIndex + ". Area Name: " + newArea);
        this.setState({
            selectedAreaName: newArea,
            selectedAreaIndex: newIndex,
        });
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {
        let { errors = {}, secureTextEntry, email, password } = this.state;
        let areaItems = this.state.arrAreas.map((value, index) => {
            return <Picker.Item key={index} value={value.areaName} label={value.areaName} />;
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
                {/* // Selected Area Value Text */}
                <Text
                    style={{
                        fontFamily: "Ebrima",
                        fontSize: 37,
                        color: "white",
                        marginTop: 10,
                    }}
                >
                    {this.state.selectedCity != null ? this.state.selectedCity.cityName : ""}
                </Text>
                {/* // Select Area Text */}
                <Text
                    style={{
                        fontFamily: "Ebrima",
                        fontSize: 20,
                        color: "white",
                        marginTop: 10,
                    }}
                >
                    SELECT AREA
                </Text>

                <Picker
                    selectedValue={this.state.selectedAreaName === undefined ? "" : this.state.selectedAreaName}
                    style={{ height: 100, width: 200 }}
                    onValueChange={this.onChangeArea}
                    itemStyle={{ color: "white", fontFamily: "Ebrima", fontSize: 20 }}
                >
                    {areaItems}
                </Picker>
                {/* // Back and Reset Buttons View */}
                <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-around", marginTop: 100 }}>
                    {/* // Back Button */}
                    <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressBack}>
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>Back</Text>
                    </TouchableOpacity>

                    {/* // Sign Up Button */}
                    <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.onPressOK}>
                        <Text style={{ color: "white", fontFamily: "Ebrima", fontWeight: "bold" }}>OK</Text>
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
)(AreaScreen);

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
