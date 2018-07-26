import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../..//Helper/Constants";

// Variable
const { width, height } = Dimensions.get("window");
const paymentMethodImageHeight = 50;
const redeemPointViewViewHeight = (7.5 * Dimensions.get("window").height) / 100;

export default StyleSheet.create({
    mainContainer: {
        // margin: 8,
        flexDirection: "row",
        backgroundColor: constant.darkGrayBGColor,
        alignItems: "center",
        justifyContent: "center",
        // marginBottom:10
        // flex: 1,
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
        margin: 8,
        fontSize: 13,
        fontFamily: constant.themeFont,
    },
    boldTitleText: {
        // margin: 12,
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: constant.themeFont,
    },
    orderHistoryItemConstainerStyle: {
        flexDirection: "row",
        flex: 1,
        // justifyContent: "space-between",
        // alignItems: "center",
        // marginBottom: 10,
        backgroundColor: "white",
        // paddingTop: 10,
        // paddingBottom: 10,
        margin:8,
        marginBottom: 0,
    },
    orderStatusViewStyle: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: "transparent",
        borderWidth: 2,
        borderRadius: 11,
        height: 22,
        width: 100,
        // margin: 4,
    },
});
