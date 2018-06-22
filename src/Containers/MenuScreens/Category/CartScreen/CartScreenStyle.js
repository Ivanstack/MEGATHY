import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

const { width, height } = Dimensions.get("window");
const orderNowViewHeight = (12 * height) / 100;

export default StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  headerText: {
    color: "white",
    marginTop: 4,
    // marginLeft: 5,
    fontSize: 15,
    fontFamily: constant.themeFont
  },
  overlayLayer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black"
  },
  addProductImg: {
    width: 18,
    height: 18,
    margin: 4
  },
  addProductBtn: {
    backgroundColor: "transparent"
    // marginTop: 20,
    // marginRight: 10
  },
  cartProductPriceLbl: {
    fontSize: 14,
    fontFamily: constant.themeFont,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 5
  },
  cartProductQuentityLbl: {
    fontSize: 14,
    fontFamily: constant.themeFont,
    // color: "gray",
    marginLeft: 10,
    marginTop: 2
  },
  cartProductNameLbl: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: constant.themeFont,
    color: constant.themeColor,
    marginLeft: 10
  },
  cartProductImg: {
    width: 100,
    height: 100,
    marginBottom: 5,
    backgroundColor: "transparent"
  },
  cartItemCountainer: {
    flex: 1,
    backgroundColor: "white",
    // width: "100%",
    flexDirection: "row",
    // marginLeft: 5,
    marginBottom: 1
  },
  selectedProductQuentity: {
    width: 18,
    height: 18,
    margin: 4
  },
  productSelectBtns: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "20%",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  cartImg: {
    width: 30,
    height: 30,
    marginLeft: 20
    // margin: 5
  },
  cartContainer: {
    // position: "absolute",
    // bottom:0,
    backgroundColor: constant.themeColor, //"#F5F5F5",
    width: "100%",
    height: "8%",
    // justifyContent:"space-between",
    flexDirection: "row"
    // marginBottom: 50,
  },
  cartBadge: {
    position: "absolute",
    bottom: "50%",
    left: "75%",
    width: 20,
    height: 20,
    backgroundColor: constant.themeColor,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  cartItemLbl: {
    fontFamily: constant.themeFont,
    fontSize: 9,
    fontWeight: "bold",
    color: "white"
  },
  scheduleAndOrderBtns: {
    width: 150,
    height: 40,
    backgroundColor: constant.themeColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent"
    // marginBottom: 10,
  },
  ScheduleAndOrderNowViewStyle: {
    width: "100%",
    height: orderNowViewHeight,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  }
});
