import { StyleSheet, Dimensions } from "react-native";

import * as constant from '../Helper/Constants'


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: constant.themeColor,
  }, 
  headerText: {
    color: "white",
    margin: 4,
    // marginLeft: 5,
    fontSize: 15,
    fontFamily: constant.themeFont, flex: 1
  },
});
