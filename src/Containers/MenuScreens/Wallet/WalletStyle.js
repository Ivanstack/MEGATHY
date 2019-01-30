import { StyleSheet, Dimensions } from "react-native";
import * as constant from "../../../Helper/Constants";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white", //constant.darkGrayBGColor,
        // width: "100%",
    },
    imgRedeemPointShow: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        // backgroundColor: "red"
    },
    imgHeaderRedeemPointShow: {
        height: 70,
        width: 70,
        justifyContent: "center",
        alignItems: "center",
        // marginRight: 16,
        // backgroundColor: "red"
    },
    segmentBtns: {
        width: Dimensions.get("window").width / 3,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    segmentBtnsTxt: {
        fontFamily: constant.themeFont,
    },
    seperatorView: {
        position: "absolute",
        width: "100%",
        height: StyleSheet.hairlineWidth,
        bottom: 0,
        backgroundColor: constant.darkGrayBGColor,
    },
    navigationHeaderText: {
        color: "white",
        // marginLeft: 5,
        fontSize: 15,
        fontFamily: constant.themeFont,
        // flex: 1
    },
    navigationFlatList: {
        margin: 4,
        height: 44,
    }
});
