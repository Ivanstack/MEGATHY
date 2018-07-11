/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import { Text, View, Image, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../../Resources/Localization/baseLocalization"; // Localization
import { CalendarList } from "react-native-calendars";
import SelectTimeScheduleScreen from "../SelectTimeSchedule/SelectTimeScheduleScreen";
import moment from "moment";

var selectedDay = null;
class CalendarScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            selectedCalendarDates: {},
            selectTimeScreenVisible: false,
        };
    }

    componentDidMount() {
        this.props.getUserBookedSession();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isGetSuccess === true) {
            this.setState({
                selectedCalendarDates:{}
            })

            this.props.parentScreen.selectedDates = newProps.arrUserBookedSessions
            newProps.arrUserBookedSessions.map((value, index) => {
                let key = value.date;
                let selected = true;
                if (!this.state.selectedCalendarDates.hasOwnProperty(key)) {
                    const updatedDates = {
                        ...this.state.selectedCalendarDates,
                        ...{ [key]: { selected } },
                    };
                    this.setState({
                        selectedCalendarDates: updatedDates,
                    });
                }
            })
        } else if (newProps.isUnsetSuccess === true) {
            this.props.getUserBookedSession();
        }
    }

    _onPressCalendarDate = day => {
        this.selectedDay = day;
        constant.debugLog("Selected Address: ", this.props.parentScreen.selectedAddress);
        this.setState({
            selectTimeScreenVisible: true,
        });
    }

    _onRemoveBookedTimeSlot = item => {
        var orderTimeSessionParameters = {
            date: item.date,
        };

        this.props.unsetOrderTimeSession(item.orderTimeSessionId, orderTimeSessionParameters);
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

    _renderInfoViewSelectedTimeSlot = () => {
        return (
            /* // Info View Selected Time Slots */
            <View style={styles.infoView}>
                <Text>{baseLocal.t("Selected time slots")}</Text>
                <Text>{baseLocal.t("*Tap on a time slot to remove")}</Text>
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
                    markedDates={this.state.selectedCalendarDates}
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

    _renderBookedTimeSlotItem = item => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
                <Text style={{ fontFamily: constant.themeFont, fontSize: 18, marginLeft: 5 }}>
                    {moment(item.item.date, "YYYY-MM-DD").format("DD-MM-YYYY") +
                        " | " +
                        moment(item.item.time, "HH:mm:ss").format("hh:mm A")}
                </Text>
                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this._onRemoveBookedTimeSlot(item.item)}>
                    <Image
                        style={{ height: 20, width: 20 }}
                        source={require("../../../../Resources/Images/CartScr/BtnRemoveFromCart.png")}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    _renderHeaderComponent = () => {
        return (
            <View style={{ width: "100%" }}>
                {this._renderInfoViewTimeRemaining()}
                {this._renderCalendarComponent()}
                {this._renderInfoViewSelectedTimeSlot()}
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
                <SelectTimeScheduleScreen parentScreen={this} />
            </Modal>
        );
    };

    render() {
        return (
            // Main View (Container)
            <View style={styles.container}>
                {this._renderSelectTimeScreenWithModal()}
                {/* <Spinner visible={this.props.isLoading} cancelable={true} textStyle={{ color: "#FFF" }} /> */}
                {/* // Main Scroll View */}
                <FlatList
                    style={{
                        marginTop: 8,
                        width: "100%",
                        height: "89%",
                    }}
                    ref={flatList => {
                        this.arrUserBookedSessions = flatList;
                    }}
                    data={this.props.arrUserBookedSessions}
                    keyExtractor={(item, index) => item.orderTimeSessionId.toString()}
                    renderItem={this._renderBookedTimeSlotItem}
                    ListHeaderComponent={this._renderHeaderComponent}
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={false}
                    directionalLockEnabled
                />

                {/* <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}> */}
                {/* // Info View Time Remaining */}
                {/* {this._renderInfoViewTimeRemaining()} */}

                {/* // Calendar View */}
                {/* {this._renderCalendarComponent()} */}
                {/* </ScrollView> */}
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.calendar.isLoading,
        isGetSuccess: state.calendar.isGetSuccess,
        isUnsetSuccess: state.calendar.isUnsetSuccess,
        error: state.calendar.error,
        arrUserBookedSessions: state.calendar.arrUserBookedSessions,
        serverCurrentTime: state.calendar.serverCurrentTime,
        bookTime: state.calendar.bookTime,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUserBookedSession: parameters =>
            dispatch({
                type: constant.actions.getUserBookedSessionRequest,
                payload: {
                    endPoint: constant.APIGetUserBookedSession,
                    parameters: "",
                },
            }),
        unsetOrderTimeSession: (orderTimeSessionId, parameters) =>
            dispatch({
                type: constant.actions.unsetOrderTimeSessionRequest,
                payload: {
                    endPoint: constant.APIUnsetOrderTimeSession + "/" + orderTimeSessionId,
                    parameters: parameters,
                },
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
