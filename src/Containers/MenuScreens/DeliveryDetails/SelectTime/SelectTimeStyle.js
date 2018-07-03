import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

const { width, height } = Dimensions.get("window");
const orderNowViewHeight = (12 * height) / 100;

export default StyleSheet.create({
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
