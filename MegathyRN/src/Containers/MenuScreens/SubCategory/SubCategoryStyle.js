import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../Helper/Constants";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  btnStyle: {
    textAlign: "center",
    color: "#333333",
    // fontSize: 17,
    fontFamily: constant.themeFont,
    margin: 5
  },
  headerText: {
    color: "white",
    margin: 4,
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
    opacity: 0.3,
    backgroundColor: "black"
  },
  bannerWrapper: {
    height: 170,
    backgroundColor: "transparent"
  },
  slide: {
    width: Dimensions.get("window").width - 10,
    // height:200,
    // justifyContent: "center",
    backgroundColor: "green"
  },
  image: {
    width: Dimensions.get("window").width - 20,
    height: "100%"
    // flex: 1,
  },
  addProductImg: {
    width: 20,
    height: 20,
    marginBottom: 2
  },
  addProductBtn: {
    backgroundColor: "transparent",
    marginTop: 20,
    marginRight: 10
  },
  productPriceLbl: {
    fontSize: 13,
    fontFamily: constant.themeFont,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 5
  },
  productQuentityLbl: {
    fontSize: 13,
    fontFamily: constant.themeFont,
    color: "gray",
    marginLeft: 10,
    marginTop: 5
  },
  productNameLbl: {
    fontSize: 15,
    fontFamily: constant.themeFont,
    color: "black",
    marginLeft: 10
  },
  productImg: {
    width: "100%",
    height: 200,
    backgroundColor: "transparent"
  },
  productCountainer: {
    backgroundColor: "white",
    width: "48%",
    marginLeft: 5,
    marginBottom: 5
  }
});
