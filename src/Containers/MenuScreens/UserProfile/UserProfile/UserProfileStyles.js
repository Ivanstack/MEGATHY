import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

const { width, height } = Dimensions.get("window");
const orderNowViewHeight = (12 * height) / 100;

export default StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        margin: 15,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        height: Dimensions.get("window").height,
    },
    btnTxtStyle: {
        fontFamily: constant.themeFont,
        color: constant.iosDefaultBlueColor,
    },
    headerText: {
        color: "white",
        margin: 4,
        // marginLeft: 5,
        fontSize: 15,
        fontFamily: constant.themeFont,
    },
});
