import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

// Variable
const { width, height } = Dimensions.get("window");
const paymentMethodImageHeight = 50;
const redeemPointViewViewHeight = (7.5 * Dimensions.get("window").height) / 100;

export default StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        backgroundColor: constant.darkGrayBGColor,
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        color: "white",
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    normalTitleText: {
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    amountText: {
        fontSize: 15,
        fontFamily: constant.themeFont,
        color: constant.themeColor,
    },
    smallSizeFontTitleText: {
        margin: 8,
        fontSize: 13,
        fontFamily: constant.themeFont,
    },
    boldTitleText: {
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: constant.themeFont,
    },
    orderHistoryItemConstainerStyle: {
        flexDirection: "row",
        flex: 1,
        backgroundColor: "white",
        margin: 8,
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
    },
});
