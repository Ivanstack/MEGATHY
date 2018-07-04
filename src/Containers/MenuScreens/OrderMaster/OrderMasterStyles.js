import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../Helper/Constants";

const { width, height } = Dimensions.get("window");
const goToNextPageViewHeight = (7.5 * height) / 100;

export default StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  headerText: {
    color: "white",
    // marginTop: 4,
    alignItems: "center",
    // marginLeft: 5,
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: constant.themeFont
  },
  goToNextPageView: {
    //   flex: 1,
    width: "100%",
    height: "7.5%",
    position: "absolute",
    bottom: 0,
    backgroundColor: constant.themeColor,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  orderActionView: {
    //   flex: 1,
    width: "100%",
    height: "14%",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 5
    // alignItems: 'center',
  },
  swipeViewWrapper: {
    flex: 1
    // backgroundColor: "transparent"
  },
  nextImgStyle: {
    width: 21,
    height: 14
  },
  nextViewStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
    // padding: 15,
  },
  addressListContainerStyle: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginBottom: goToNextPageViewHeight+10
    // backgroundColor: "blue"
  },
  orderTimeSlotContainerStyle: {
    flex: 1,
    marginBottom: goToNextPageViewHeight+0,
    backgroundColor:"white"
  },
  paymentContainerStyle: {
    flex: 1,
    marginBottom: goToNextPageViewHeight-14,
    backgroundColor:"white"
  }
});
