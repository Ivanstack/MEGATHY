/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";

import * as constant from "../../../../Helper/Constants";

// Redux
import { connect } from "react-redux";

// Libs
import CollapsibleList from "react-native-collapsible-list";
import SegmentedControlTab from "react-native-segmented-control-tab";

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// Component Style
import SelectTimeStyle from "./SelectTimeStyle";

// Variable
const arrTimeInterval = ["00", "10", "20", "30", "40", "50"];

class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        // this._onPressCalendarDate = this._onPressCalendarDate.bind(this)
        this.state = {
            arrSetTimeSlote: [],
            arrOrderBookedTimeSlote: [],
            arrForBookedSlote: [],
            crntSelectedSegment: 0,
            crntStoreTime: "",
            isTimeSlotOpen: false,
        };
        this.numberOfVisibleItems = 1;
        this.crntOpenTimeSlot = [];
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            if (navigation.state.params != undefined && navigation.state.params.category != undefined) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("DrawerToggle");
                            }
                        }}
                    >
                        <Icon
                            name={
                                navigation.state.params != undefined && navigation.state.params.category != undefined
                                    ? "arrow-left"
                                    : "navicon"
                            }
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={SelectTimeStyle.headerText}> Meghathy </Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    componentDidMount() {
        // this.props.onRef(this)
        this._getAPIGetOrderTimeSession();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isSuccess === true && newProps.objOrderBookedTimeSlote != null) {
            this.setState(
                {
                    arrOrderBookedTimeSlote: newProps.objOrderBookedTimeSlote.orderSlots,
                    crntStoreTime: newProps.objOrderBookedTimeSlote.storeTime,
                },
                () => this._getRemainingHours()
            );
        }
    }

    componentWillUnmount() {
        // this.props.onRef(undefined)
        constant.debugLog("componentWillUnmount call from select time .....");
    }

    // Convert Time into 12hrs Formate
    _convertHourFormate = (isTitle, hours) => {
        // let convertHour = ""
        if (isTitle) {
            if (hours === 0 || hours === 12) {
                return hours === 12 ? "12pm" : "12am";
            } else if (hours > 12) {
                return `${hours - 12}pm`;
            } else {
                return `${hours}am`;
            }
        } else {
            hour1 = hours.split("-")[0].split(":")[0];
            minute1 = hours.split("-")[0].split(":")[1];
            hour2 = hours.split("-")[1].split(":")[0];
            minute2 = hours.split("-")[1].split(":")[1];

            hour1 = hour1 == 0 ? 12 : hour1 > 12 ? hour1 - 12 : hour1;
            hour2 = hour2 == 0 ? 12 : hour2 > 12 ? hour2 - 12 : hour2;

            return hour1 + ":" + minute1 + " - " + hour2 + ":" + minute2;
        }
    };

    // Check Time Slot Available Status
    _checkTimeSlotAvailableStatus = timeSlot => {
        let bookedTimeSlotCount = 0;
        timeSlot.map(item => {
            if (item.isBooked) {
                bookedTimeSlotCount = bookedTimeSlotCount + 1;
            }
        });

        if (bookedTimeSlotCount === 6) {
            return constant.themeColor;
        } else if (bookedTimeSlotCount < 6 && bookedTimeSlotCount > 0) {
            return constant.themeYellowColor;
        } else {
            return constant.themeGreenColor;
        }
    };

    // Check Time Slot Available
    _getBookedTimeSlot = (checkeTimeSlot, strCheckTime) => {
        let objSlot = this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment].otherBookTime;

        let bookedOrderTimeSlot = objSlot[`slot${checkeTimeSlot}`];
        // constant.debugLog("Booked Time Slot : ===> " + bookedOrderTimeSlot);

        if (bookedOrderTimeSlot && bookedOrderTimeSlot.length > 0) {
            for (let index = 0; index < 6; index++) {
                const bookedTimeSlotElement = bookedOrderTimeSlot[index];
                if (bookedTimeSlotElement && bookedTimeSlotElement.includes(checkeTimeSlot)) {
                    return true;
                }
            }
        }
        return false;
        // constant.debugLog("Booked Time Slot item : ===> " + checkeTimeSlot);
    };

    // Create Time Slot in 10 Minutes Gap
    _creatTimeSlotWithTime = timeslote => {
        let arrTimeSlot = [];
        let oldTimeSlot = timeslote;
        // timeslote = this._convertHourFormate(false, timeslote);
        for (let index = 0; index < arrTimeInterval.length; index++) {
            let showTimeSlotTitle = "";
            if (index === arrTimeInterval.length - 1) {
                showTimeSlotTitle = `${timeslote}:${arrTimeInterval[index]} - ${timeslote + 1}:${arrTimeInterval[0]}`;
                // showTimeSlotTitle = `${timeslote}:${arrTimeInterval[index]} - ${this._convertHourFormate(
                //     false,
                //     timeslote + 1
                // )}:${arrTimeInterval[0]}`;
            } else {
                showTimeSlotTitle = `${timeslote}:${arrTimeInterval[index]} - ${timeslote}:${
                    arrTimeInterval[index + 1]
                }`;
            }
            let timeSlotStatus = {};
            timeSlotStatus["title"] = showTimeSlotTitle;
            timeSlotStatus["isBooked"] = this._getBookedTimeSlot(oldTimeSlot, arrTimeInterval[index]);
            arrTimeSlot.push(timeSlotStatus);
        }
        return arrTimeSlot;
    };

    // Get Value For Show In Segment Control
    _getValueForSegmentDate = () => {
        let arrDateValue = [];
        for (let index = 0; index < this.state.arrOrderBookedTimeSlote.length; index++) {
            const dateElement = this.state.arrOrderBookedTimeSlote[index];
            arrDateValue.push(dateElement.date);
        }
        return arrDateValue;
    };

    // API Call for Get Booked Time Slotes
    _getAPIGetOrderTimeSession = () => {
        let cityIds = global.currentStore.cityId.toString().split(",");
        var orderTimeSessionParameters = {
            city_id: cityIds[0],
            dynamic_hour: true,
        };

        // constant.debugLog("orderTimeSession Parameters :====> " + orderTimeSessionParameters);

        this.props.getOrderTimeSession(orderTimeSessionParameters);
    };

    // Get Remaining Hours and Make Time Slot for order
    _getRemainingHours() {
        let today = new Date(this.state.crntStoreTime);
        var todayHour = today.getHours();

        var nextDay = new Date(today);
        var remainigHours = 0;
        nextDay.setDate(today.getDate() + 1);

        let dateForSegment = this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment].date;
        let crntDateForCompare = new Date().toISOString().substring(0, 10);
        // console.log("Todays Hours : ==> ", crntDateForCompare);
        // console.log("Compare Date Hours : ==> ", dateForSegment);

        let strNextDay = this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment].date + " " + "00:00:00";
        if (global.currentSettings != null && global.currentSettings != undefined) {
            strNextDay =
                this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment].date +
                " " +
                global.currentSettings["working-hours"].start;
        }
        if (crntDateForCompare === dateForSegment) {
            if (this.state.crntSelectedSegment + 1 <= this.state.arrOrderBookedTimeSlote.length) {
                nextDay = new Date(this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment + 1].date);
            }
            if (global.currentSettings != null && global.currentSettings != undefined) {
                strNextDay =
                    this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment + 1].date +
                    " " +
                    global.currentSettings["working-hours"].start;
            }

            // nextDay.setHours(0, 0, 0, 0);
            var delta = Math.abs(Date.parse(strNextDay) - today.getTime()) / 1000;
            remainigHours = Math.floor(delta / 3600);
            // console.log("Todays Hours : ==> ", new Date().toLocaleDateString("en-us"));
        } else {
            let nextDate = new Date(strNextDay);
            todayHour = nextDate.getHours();
            remainigHours = 23 - todayHour;
        }
        // console.log("Next Hours : ==> ", nextDay);

        let arrRemainig = [];
        let timeSloteData = {};

        timeSloteData["time"] = todayHour;
        timeSloteData["timeSlot"] = this._creatTimeSlotWithTime(todayHour);
        timeSloteData["isOpen"] = false;
        arrRemainig.push(timeSloteData);

        for (let index = 0; index < remainigHours; index++) {
            todayHour = todayHour + 1;
            let newTimeSloteData = {};
            newTimeSloteData["time"] = todayHour;
            newTimeSloteData["timeSlot"] = this._creatTimeSlotWithTime(todayHour);
            newTimeSloteData["isOpen"] = false;
            arrRemainig.push(newTimeSloteData);
        }
        // console.log("TimeSlot In Json :===> ", arrRemainig);
        this.setState({ arrSetTimeSlote: arrRemainig });
    }

    _checkedSlotBookedByCrntUser = slot => {
        let slotBookedDate = this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment].date;
        if (
            this.state.arrForBookedSlote[0] != undefined &&
            this.state.arrForBookedSlote[0].tempBookedDate === slotBookedDate &&
            this.state.arrForBookedSlote[0].title === slot.title
        ) {
            return true;
        }

        return false;
    };

    // OnPress Methods
    _onPressSegmentChange = index => {
        // console.log("Segment Change :===> ", index);
        this.setState(
            {
                crntSelectedSegment: index,
            },
            () => this._getRemainingHours()
        );
    };

    _onPressSelectTimeSlot = item => {
        // let arrTimeSlote = new Array(this.state.arrForBookedSlote);
        if (!item.isBooked) {
            let arrTimeSlote = this.state.arrForBookedSlote;

            if (arrTimeSlote.length != 0) {
                arrTimeSlote = [];
            }
            item.tempBookedDate = this.state.arrOrderBookedTimeSlote[this.state.crntSelectedSegment].date;
            global.selectedTimeSlot = item;
            arrTimeSlote.push(item);
            this.setState({ arrForBookedSlote: arrTimeSlote });
        }
    };

    _onPressCalendarDate() {
        let key = this.props.day.dateString;
        let selected = true;
        if (!this.props.parentScreen.state.selectedDates.hasOwnProperty(key)) {
            const updatedDates = { ...this.props.parentScreen.state.selectedDates, ...{ [key]: { selected } } };
            this.props.parentScreen.setState({ selectedDates: updatedDates, selectTimeScreenVisible: false });
        }
    }

    // Render Methods
    _renderTagItem = ({ item, index }) => {
        // constant.debugLog("Tag item :===> " + JSON.stringify(item));
        return (
            <TouchableWithoutFeedback onPress={() => this._onPressSelectTimeSlot(item)}>
                <View
                    style={[
                        SelectTimeStyle.tagBtnStyle,
                        {
                            backgroundColor: this._checkedSlotBookedByCrntUser(item)
                                ? constant.themeGreenColor
                                : item.isBooked
                                    ? constant.themeColor
                                    : "lightgray",
                        },
                    ]}
                >
                    <Text style={SelectTimeStyle.headerText}> {this._convertHourFormate(false, item.title)} </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _renderItem = ({ item }) => {
        let timeSlotStatusColor = this._checkTimeSlotAvailableStatus(item.timeSlot);
        let imgForTimeSlotViewOpenStatus = item.isOpen
            ? require("../../../../Resources/Images/Order/upArrowRetract.png")
            : require("../../../../Resources/Images/Order/downArrowExpand.png");
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <CollapsibleList
                    numberOfVisibleItems={1}
                    animationConfig={{ duration: 200 }}
                    onToggle={collapsed => {
                        item.isOpen = collapsed;
                        this.setState({ isTimeSlotOpen: collapsed });
                    }}
                    buttonContent={
                        <View
                            style={{
                                width: "100%",
                                height: 40,
                                backgroundColor: "white",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={SelectTimeStyle.txtTimeSlotTitle}>
                                    {this._convertHourFormate(true, item.time)}-{this._convertHourFormate(
                                        true,
                                        item.time + 1
                                    )}
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: "white",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    right: 0,
                                }}
                            >
                                <Image
                                    style={{ width: 20, height: 20, margin: 10 }}
                                    source={imgForTimeSlotViewOpenStatus}
                                />

                                <View
                                    style={{
                                        height: "100%",
                                        width: 4,
                                        backgroundColor: timeSlotStatusColor,
                                        right: 0,
                                    }}
                                />
                            </View>
                        </View>
                    }
                    items={[
                        <View style={SelectTimeStyle.collapsibleItem} />,
                        <View
                            style={{
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: "#CCC",
                                paddingBottom: 10,
                            }}
                        >
                            <FlatList
                                keyExtractor={(item, index) => item.title}
                                extraData={this.state}
                                data={item.timeSlot}
                                horizontal={false}
                                renderItem={this._renderTagItem}
                                numColumns={3}
                            />
                        </View>,
                        <View style={SelectTimeStyle.collapsibleItem} />,
                    ]}
                />
            </View>
        );
    };

    _renderTimeSlotStatusInstructorView = () => {
        let arrTimeSlotStatus = [
            { status: "Booked", color: constant.themeColor },
            { status: "Available", color: constant.themeGreenColor },
            { status: "Partial", color: constant.themeYellowColor },
        ];
        const renderedTimeSlotStatusView = arrTimeSlotStatus.map(timeSlotStatus => {
            // constant.debugLog("Render timeslotstatus : " + timeSlotStatus);
            return (
                <View style={SelectTimeStyle.slotStatusIndicatorView} key={timeSlotStatus.status}>
                    <View
                        style={{
                            width: 4,
                            height: "60%",
                            backgroundColor: timeSlotStatus.color,
                        }}
                    />
                    <Text style={SelectTimeStyle.txtTimeSlotStatus}>{timeSlotStatus.status}</Text>
                </View>
            );
        });

        return renderedTimeSlotStatusView;
    };

    _renderCustomNavigationView = () => {
        return (
            <View
                style={{ backgroundColor: constant.themeColor, flexDirection: "row", justifyContent: "space-between" }}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.parentScreen != undefined
                                ? this.props.parentScreen.setState({ selectTimeScreenVisible: false })
                                : constant.debugLog("Parent is not calendar");
                        }}
                    >
                        <Icon name={"arrow-left"} style={{ marginLeft: 10 }} size={35} color="white" />
                    </TouchableOpacity>
                    <Text> Time Slots </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.props.parentScreen != undefined
                            ? this._onPressCalendarDate()
                            : constant.debugLog("Parent is not calendar");
                    }}
                >
                    <Text> Save </Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        return (
            // Main View (Container)
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    {/* ----- Segment View ----- */}
                    <View>
                        {this.props.parentScreen === undefined ? null : this._renderCustomNavigationView()}
                        <ScrollView
                            // style={{ backgroundColor: "orange"}}
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <SegmentedControlTab
                                tabsContainerStyle={SelectTimeStyle.tabsContainerStyle}
                                tabStyle={SelectTimeStyle.tabStyle}
                                tabTextStyle={{ color: constant.themeColor }}
                                activeTabStyle={SelectTimeStyle.activeTabStyle}
                                borderRadius={0}
                                values={this._getValueForSegmentDate()}
                                selectedIndex={this.state.crntSelectedSegment}
                                onTabPress={this._onPressSegmentChange}
                            />
                        </ScrollView>
                    </View>

                    {/* ----- Time Slote View ----- */}
                    <View style={{ width: "100%", marginBottom: 30 }}>
                        <View>
                            <FlatList
                                style={{ width: "100%", marginBottom: 30 }}
                                keyExtractor={item => item.time.toString()}
                                extraData={this.state}
                                ref={flatList => {
                                    this.timeslote = flatList;
                                }}
                                data={this.state.arrSetTimeSlote}
                                renderItem={this._renderItem}
                            />
                        </View>
                    </View>

                    {/* ----- Time Slot Status Instruction View ----- */}
                    <View
                        style={{
                            justifyContent: "space-between",
                            position: "absolute",
                            bottom: 0,
                            flexDirection: "row",
                            backgroundColor: "white",
                            position: "absolute",
                            bottom: 0,
                        }}
                    >
                        {this._renderTimeSlotStatusInstructorView()}
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.selectTime.isLoading,
        isSuccess: state.selectTime.isSuccess,
        objOrderBookedTimeSlote: state.selectTime.objOrderBookedTimeSlote,
        error: state.selectTime.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderTimeSession: parameters =>
            dispatch({
                type: constant.actions.getOrderTimeSessionRequest,
                payload: {
                    endPoint: constant.APIGetOrderTimeSession,
                    parameters: parameters,
                },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectTimeScreen);
