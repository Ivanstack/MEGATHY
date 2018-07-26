import { StyleSheet, Dimensions } from "react-native";
import * as constant from "../../../../Helper/Constants";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: constant.darkGrayBGColor,
    },
    twoThemeButtonsContainer: {
        width: "95%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 5,
    },
    twoThemeButtons: {
        width: "48.5%",
        marginTop: 20,
        backgroundColor: constant.themeColor,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        // borderRadius: 20,
    },
    themeButtonText: {
        color: "white",
        fontFamily: "Ebrima",
        fontWeight: "bold",
        fontSize: 16,
    },
    imgMsgStyle: {
        width: 15,
        height: 15,
        position: "absolute",
        top: 10,
    },
    orderStatusContainer: {
        width: "90%",
        // marginTop: "12%",
        marginLeft: 10,
        flexDirection: "row",
        height: 60, //"13.5%",
    },
});
