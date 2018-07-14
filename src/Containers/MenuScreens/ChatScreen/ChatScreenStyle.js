import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../Helper/Constants";

// Variable
const { width, height } = Dimensions.get("window");
const paymentMethodImageHeight = 50;
const redeemPointViewViewHeight = (7.5 * Dimensions.get("window").height) / 100;

export default StyleSheet.create({
    mainContainer: {
        // margin: 8,
        // flexDirection: "row",
        backgroundColor: constant.darkGrayBGColor,
        // alignItems: "center",
        // justifyContent: "center",
        flex: 1,
        // width:"100%",
        // height:"100%"
    },
    scrollView: {
        flexGrow: 1,
        backgroundColor: "blue",
        margin: 8,
        // flex: 1,
        // justifyContent: "flex-start",
        // alignItems: "center",
        // width:"100%",
        // height: Dimensions.get("window").height,
    },
    headerText: {
        color: "white",
        // margin: 4,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    normalTitleText: {
        // margin: 8,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    smallSizeFontTitleText: {
        margin: 4,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    boldTitleText: {
        // margin: 12,
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: constant.themeFont,
    },
    orderHistoryItemConstainerStyle: {
        flex: 1,
        // justifyContent: "space-between",
        // alignItems: "center",
        // marginBottom: 10,
        backgroundColor: "white",
    },
    imgMsgStyle: {
        width: 15,
        height: 15,
        position: "absolute",
        bottom: 0,
    },
});
