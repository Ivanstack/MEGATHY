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

var selectedCity = null
class AreaScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.onPressOK = this.onPressOK.bind(this);
        this.onPressBack = this.onPressBack.bind(this);
        this.onChangeArea = this.onChangeArea.bind(this);

        this.state = {
            // arrAreas: [],
            selectedAreaName: "",
            selectedAreaIndex: -1,
            visible: false,
        };
    }

    componentWillMount() {
        selectedCity = this.props.navigation.getParam("selectedCity", "");
        var areaParameters = {
            cityId: selectedCity.PkId,
        };
        this.props.getAreas(areaParameters)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isSuccess === true && newProps.arrAreas.length > 0) {
            this.setState({
                selectedAreaName: newProps.arrAreas[0].areaName,
                selectedAreaIndex: 0,
            });
        }
    }

    onPressBack() {
        this.props.navigation.goBack();
    }

    onPressOK() {
        this.props.navigation.navigate("StoreScreen", {
            selectedCity: selectedCity,
            selectedArea: this.props.arrAreas[this.state.selectedAreaIndex],
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
        let areaItems = this.props.arrAreas.map((value, index) => {
            let areaNameTemp = global.currentAppLanguage === "en" ? value.areaName : value.areaNameAr;
            return <Picker.Item key={index} value={areaNameTemp} label={areaNameTemp} />;
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
                    {selectedCity != null
                        ? global.currentAppLanguage === "en"
                            ? selectedCity.cityName
                            : selectedCity.cityNameAr
                        : ""}
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
                    {baseLocal.t("SELECT AREA")}
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
        isLoading: state.area.isLoading,
        isSuccess: state.area.isSuccess,
        arrAreas: state.area.arrAreas,
        error: state.area.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAreas: parameters =>
            dispatch({
                type: constant.actions.getAreaRequest,
                payload: { endPoint: constant.APIGetArea, parameters: parameters },
            }),
    };
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
