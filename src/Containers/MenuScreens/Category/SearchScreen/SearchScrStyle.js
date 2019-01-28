import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../../../Helper/Constants";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#838280"
  },
  btnStyle: {
    textAlign: "center",
    color: "#333333",
    fontFamily: constant.themeFont,
    margin: 5
  },
  headerTextInput: {
    borderRadius:8, 
    height: 35,
    width:300,
    backgroundColor:"white",
    marginRight:10,
    marginTop:5,
    fontSize: 15,
    fontFamily: constant.themeFont,
    flex:1,
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
  headerStyle: {
    backgroundColor: constant.themeColor,
    height:138,
    flexDirection: 'column',
     width: "100%",
},
});
