/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, TouchableOpacity, ScrollView, Modal } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import { CalendarList } from "react-native-calendars";
import SelectTimeScreen from "../SelectTime/SelectTimeScreen";

var selectedDay = null;
class CalendarScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this._onPressCalendarDate = this._onPressCalendarDate.bind(this);
        this.state = {
            selectedDates: {},
            selectTimeScreenVisible: false,
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(newProps) {}

    _onPressCalendarDate(day) {
        this.selectedDay = day
        this.setState({
            selectTimeScreenVisible: true,
        });
        // let key = day.dateString;
        // let selected = true;
        // if (!this.state.selectedDates.hasOwnProperty(key)) {
        //     const updatedDates = { ...this.state.selectedDates, ...{ [key]: { selected } } };
        //     this.setState({ selectedDates: updatedDates });
        // }
    }

    _renderInfoViewTimeRemaining = () => {
        return (
            /* // Info View Time Remaining */
            <View style={styles.infoView}>
                <Text>{baseLocal.t("Select delivery dates")}</Text>
                <View style={styles.subInfoView}>
                    <Text style={{ width: "70%", fontFamily: constant.themeFont, fontSize: 16 }}>
                        {baseLocal.t("Time remaining to place this order (in minutes)")}
                    </Text>
                    <Text
                        style={{
                            fontFamily: constant.themeFont,
                            fontSize: 17,
                            fontWeight: "bold",
                            color: constant.themeColor,
                        }}
                    >
                        00:00
                    </Text>
                </View>
            </View>
        );
    };

    _renderCalendarComponent = () => {
        return (
            <View style={styles.calendar}>
                <CalendarList
                    current={new Date()}
                    minDate={new Date()}
                    maxDate={CommonUtilities.dateAddingDays(30)}
                    pastScrollRange={24}
                    futureScrollRange={24}
                    horizontal
                    pagingEnabled
                    hideArrows
                    onDayPress={this._onPressCalendarDate}
                    markedDates={this.state.selectedDates}
                    style={styles.calendar}
                    theme={{
                        calendarBackground: "white",
                        todayTextColor: "blue",
                        selectedDayTextColor: "white",
                        selectedDayBackgroundColor: "#CF2526",
                    }}
                />
            </View>
        );
    };

    _renderSelectTimeScreenWithModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.selectTimeScreenVisible}
                onRequestClose={() => {
                    alert("Modal has been closed.");
                }}
            >
                <SelectTimeScreen parentScreen={this} day={this.selectedDay}/>
            </Modal>
        );
    };

    render() {
        return (
            // Main View (Container)
            <View style={styles.container}>
                {this._renderSelectTimeScreenWithModal()}
                <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} />
                {/* // Main Scroll View */}
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                    {/* // Info View Time Remaining */}
                    {this._renderInfoViewTimeRemaining()}

                    {/* // Calendar View */}
                    {this._renderCalendarComponent()}
                </ScrollView>
            </View>
        );
    }
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
)(CalendarScreen);

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
    infoView: {
        backgroundColor: constant.darkGrayBGColor,
        padding: 10,
        paddingTop: 20,
        width: "100%",
    },
    subInfoView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    calendar: {
        width: "100%",
        height: 300,
    },
});
