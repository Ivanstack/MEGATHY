import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

// Variable
const { width, height } = Dimensions.get("window");
const paymentMethodImageHeight = 50;
const redeemPointViewViewHeight = (7.5 * Dimensions.get("window").height) / 100;

export default StyleSheet.create({
    mainContainer: {
        margin: 8,
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        flex:1
    },
    headerText: {
        color: "white",
        // margin: 4,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    normalTitleText: {
        margin: 8,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
    smallSizeFontTitleText: {
        margin: 8,
        fontSize: 13,
        fontFamily: constant.themeFont,
    },
    boldTitleText: {
        margin: 12,
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: constant.themeFont,
    },
    applyBtn: {
        backgroundColor: constant.themeColor,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 30,
        // marginBottom: 4,
        marginTop: 8,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "transparent",
    },
    coupenCodeTxtField: {
        margin: 8,
        marginTop: -16,
        marginBottom: -16,
        width: "75%",
        backgroundColor: "transparent",
    },
    paymentMethodBtn: {
        height: paymentMethodImageHeight,
        width: paymentMethodImageHeight * 1.64,
        margin: 8,
        borderColor: constant.themeLightGreenColor,
        borderRadius: 5,
    },
    redeemPointView: {
        width: "100%",
        bottom: 0.65 * redeemPointViewViewHeight,
        position: "absolute",
        backgroundColor: "white",
    },
    txtInputRedeemPoint: {
        borderColor: "lightgray",
        borderWidth: 2,
        borderRadius: 20,
        height: 40,
        width: "90%",
        paddingLeft: 15,
    },
    imgRedeemPointShow: {
        height: 70,
        width: 70,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        marginTop: -20,
        // backgroundColor: "red"
    }
});
