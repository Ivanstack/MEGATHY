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
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";

import * as constant from "../../../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Libs
import CollapsibleList from "react-native-collapsible-list";
import SegmentedControlTab from "react-native-segmented-control-tab";

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// Variable
const arrTimeInterval = ["00", "10", "20", "30", "40", "50"];
const arrTimeSlotStatus = [
    { status: "Booked", color: constant.themeColor },
    { status: "Available", color: constant.themeGreenColor },
    { status: "Partial", color: constant.themeYellowColor },
];

class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
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
                    <Text style={styles.headerText}> Meghathy </Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    componentDidMount() {
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

    // Convert Time into 12hrs Formate
    _convertHourFormate = (isTitle, hours) => {
        // let convertHour = ""
        if (isTitle) {
            if (hours === 12 || hours === 24) {
                return hours === 12 ? "12pm" : "12am";
            } else if (hours > 12) {
                return `${hours - 12}pm`;
            } else {
                return `${hours}am`;
            }
        } else {
            if (hours > 12) {
                return hours - 12;
            } else {
                return hours;
            }
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
        // console.log("Booked Time Slot : ===> " + bookedOrderTimeSlot);

        // if (bookedOrderTimeSlot.lenght > 0) {
        for (let index = 0; index < 6; index++) {
            const bookedTimeSlotElement = bookedOrderTimeSlot[index];
            if (bookedTimeSlotElement && bookedTimeSlotElement.includes(checkeTimeSlot)) {
                return true;
            }
        }
        return false;
        // constant.debugLog("Booked Time Slot item : ===> " + checkeTimeSlot);
    };

    // Create Time Slot in 10 Minutes Gap
    _creatTimeSlotWithTime = timeslote => {
        let arrTimeSlot = [];
        let oldTimeSlot = timeslote;
        timeslote = this._convertHourFormate(false, timeslote);
        for (let index = 0; index < arrTimeInterval.length; index++) {
            let showTimeSlotTitle = "";
            if (index === arrTimeInterval.length - 1) {
                showTimeSlotTitle = `${timeslote}:${arrTimeInterval[index]} - ${this._convertHourFormate(
                    false,
                    timeslote + 1
                )}:${arrTimeInterval[0]}`;
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

        if (crntDateForCompare === dateForSegment) {
            nextDay.setHours(0, 0, 0, 0);
            var delta = Math.abs(nextDay.getTime() - today.getTime()) / 1000;
            remainigHours = Math.floor(delta / 3600);
            // console.log("Todays Hours : ==> ", new Date().toLocaleDateString("en-us"));
        } else {
            todayHour = 0;
            remainigHours = 23;
        }
        // console.log("Next Hours : ==> ", nextDay);

        let arrRemainig = [];
        let timeSloteData = {};
        timeSloteData["time"] = todayHour;
        timeSloteData["timeSlot"] = this._creatTimeSlotWithTime(todayHour);
        arrRemainig.push(timeSloteData);

        for (let index = 0; index < remainigHours; index++) {
            todayHour = todayHour + 1;
            let newTimeSloteData = {};
            newTimeSloteData["time"] = todayHour;
            newTimeSloteData["timeSlot"] = this._creatTimeSlotWithTime(todayHour);
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
            arrTimeSlote.push(item);
            this.setState({ arrForBookedSlote: arrTimeSlote });
        }
    };

    // Render Methods
    _renderTagItem = ({ item, index }) => {
        // constant.debugLog("Tag item :===> " + JSON.stringify(item));
        return (
            <TouchableWithoutFeedback onPress={() => this._onPressSelectTimeSlot(item)}>
                <View
                    style={[
                        styles.tagBtnStyle,
                        {
                            backgroundColor: this._checkedSlotBookedByCrntUser(item)
                                ? constant.themeGreenColor
                                : item.isBooked
                                    ? constant.themeColor
                                    : "lightgray",
                        },
                    ]}
                >
                    <Text style={styles.headerText}> {item.title} </Text>
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
                                <Text style={styles.txtTimeSlotTitle}>
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
                        <View style={styles.collapsibleItem} />,
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
                        <View style={styles.collapsibleItem} />,
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
                <View style={styles.slotStatusIndicatorView} key={timeSlotStatus.status}>
                    <View
                        style={{
                            width: 4,
                            height: "60%",
                            backgroundColor: timeSlotStatus.color,
                        }}
                    />
                    <Text style={styles.txtTimeSlotStatus}>{timeSlotStatus.status}</Text>
                </View>
            );
        });

        return renderedTimeSlotStatusView;
    };

    render() {
        return (
            // Main View (Container)
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    {/* ----- Segment View ----- */}
                    <View>
                        <ScrollView
                            // style={{ backgroundColor: "orange"}}
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <SegmentedControlTab
                                tabsContainerStyle={styles.tabsContainerStyle}
                                tabStyle={styles.tabStyle}
                                tabTextStyle={{ color: constant.themeColor }}
                                activeTabStyle={styles.activeTabStyle}
                                borderRadius={0}
                                values={this._getValueForSegmentDate()}
                                selectedIndex={this.state.crntSelectedSegment}
                                onTabPress={this._onPressSegmentChange}
                            />
                        </ScrollView>
                    </View>

                    {/* ----- Time Slote View ----- */}
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

                    {/* ----- Time Slote Status Instruction View ----- */}
                    <View
                        style={{
                            justifyContent: "space-between",
                            position: "absolute",
                            bottom: 0,
                            flexDirection: "row",
                            backgroundColor: "white",
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

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center"
        // backgroundColor: "#CF2526",
    },
    fbButtonStyle: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#EAEAEA",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    tagBtnStyle: {
        width: Dimensions.get("window").width / 3 - 11,
        marginTop: 8,
        marginLeft: 8,
        height: 30,
        borderWidth: 2,
        borderColor: "transparent",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        // borderRadius: 20,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
    headerText: {
        color: "white",
        margin: 4,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    collapsibleItem: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#CCC",
        height: 0,
        padding: 0,
    },
    wrapperCollapsibleList: {
        flex: 1,
        // marginTop: 20,
        overflow: "hidden",
        backgroundColor: "#FFF",
        borderRadius: 5,
    },
    tabStyle: {
        width: Dimensions.get("window").width / 2,
        borderColor: constant.themeColor,
        borderWidth: 2,
    },
    activeTabStyle: {
        width: Dimensions.get("window").width / 2,
        backgroundColor: constant.themeColor,
        borderWidth: 2,
    },
    tabsContainerStyle: {
        width: "100%",
        height: 35,
        // padding:4
    },
    txtTimeSlotTitle: {
        paddingLeft: 8,
        fontFamily: constant.themeFont,
        fontSize: 16,
        fontWeight: "bold",
    },
    slotStatusIndicatorView: {
        width: "33%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    txtTimeSlotStatus: {
        fontFamily: constant.themeFont,
        fontSize: 17,
        margin: 8,
    },
});
