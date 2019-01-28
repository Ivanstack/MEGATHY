import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

const { width, height } = Dimensions.get("window");
const totalCartItemsViewHeight = 20;

export default StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: constant.prodCategoryBGColor
  },
  btnStyle: {
    textAlign: "center",
    color: "#333333",
    // fontSize: 17,
    margin: 5
  },
  headerText: {
    color: "white",
    margin: 4,
    // marginLeft: 5,
    fontSize: 15,
    fontFamily: constant.themeFont,
     flex: 1
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
    height: 185,
    backgroundColor: "transparent"
  },
  slide: {
    width: Dimensions.get("window").width - 10,
    // height:200,
    // justifyContent: "center",
    backgroundColor: "green"
  },
  image: {
    width: Dimensions.get("window").width,
    height: "100%"
    // flex: 1,
  },
  dot: {
    backgroundColor: "#000000",
    opacity: 0.3,
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5
  },
  activeDot: {
    backgroundColor: "white",

    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5
  },
  pagination: {
    bottom: 5
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1.5,
    borderTopColor: "black"
  },

  loadMoreBtn: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center"
  },
  categoryItemConstainerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10
  },
  categoryItemNameTxtStyle: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: constant.themeFont
  },
  categoryProductsCountStyle: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 14,
    fontFamily: constant.themeFont,
    color: "gray"
  },
  cartTotalItemsView: {
    // justifyContent: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: totalCartItemsViewHeight,
    width: totalCartItemsViewHeight,
    top: 12,
    right: 12,
    backgroundColor: constant.themeColor,
    borderRadius: totalCartItemsViewHeight / 2,
    borderWidth: 1,
    borderColor: "transparent"
  },
  cartTotalItemsTxt: {
    fontFamily: constant.themeFont,
    fontSize: 11,
    fontWeight: "bold",
    color: "white"
  }
});
