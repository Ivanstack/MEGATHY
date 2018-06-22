// Localization
import baseLocal from "../Resources/Localization/baseLocalization";
var { EventEmitter } = require("fbemitter");

module.exports = {
  /// Other Misc Constants
  alertTitle: "Megathy",
  emitter: new EventEmitter(),
  isLogin: "false",
  loginListener: "loginListener",
  languageEnglish: "en",
  languageArabic: "ar",
  LOGOUT_EVENT: "logout",

  /// Common Functions
  debugLog: log => {
    console.log("\n====================>");
    console.log(log);
    console.log("<====================\n");
  },

  /// Async Storage Keys
  keyCurrentUser: "currentUser",
  keyCurrentSettings: "currentSettings",
  keyCurrentStore: "currentStore",
  keyCurrentAppLanguage: "currentAppLanguage",

  /// Common API request parameters
  deviceTypeiPhone: "IPHONE",
  deviceTypeAndroid: "ANDROID",
  notifyId: "0123456789",
  timeZone: "Asia/Riyadh",

  APIConfirmationTypeRegister: "Register",
  APIConfirmationTypeForgotPassword: "Forgot Password",
  APIConfirmationTypeAddress: "Address Conformation",

  /// Rest API details
  // Base URL
  baseURL: "http://192.168.0.3/megathylaravel/public/api/v1/", // Jay Kaneriya
  // baseURL: "http://192.168.0.11/Megathy/MegathyLaravel/public/api/v1/", // BharatBhai
  // baseURL: "http://192.168.0.2/MegathyLaravel/public/api/v1/", //Chintan Adatiya

  /// End Points
  // Login/Signup
  login: "userLogin",
  register: "registerUser",
  forgotPassword: "requestForgotPassword",
  verifyFBId: "verifyfacebookId",
  getCity: "getCity",
  getArea: "getArea",
  getStore: "getStore",
  setStore: "setStore",
  verifyPhoneCode: "verifyPhoneCode",
  requestVerifyPhones: "requestVerifyPhones",
  updatePassword: "updatePassword",
  

  /// Menu Screens
  getCategory: "getCategory",
  getSubCategory: "getSubCategory",
  getBanners: "banners",
  getProductList: "getProduct",
  getStoreTimeZone: "getStoreTimeZone",
  address: "address",
  
  storeId:
    "&storeId=" +
    (global.currentStore === undefined || global.currentStore === undefined)
      ? ""
      : global.currentStore.storeId,

  /// Colors
  themeColor: "#CF2526",
  prodCategoryBGColor: "#EFEDE9",
  buttonDisableColor: "#939393",
  darkGrayBGColor: "#D4D4D4",

  /// Font Family
  themeFont: "Ebrima"
};

/*
Network Utility API Call Template

    this.state = {
        visible: false,
    };

    // Show Loading View
    this.setState({ visible: true });

    networkUtility.postRequest(constant.forgotPassword, forgotPasswordParameters).then(
        result => {
            // Hide Loading View
            this.setState({ visible: false });

            // HTTP Status Code => {result.status}
        },
        error => {
            // Hide Loading View
            this.setState({ visible: false });

            constants.debugLog("\nStatus Code: " + error.status);
            constants.debugLog("\nError Message: " + error.message);
            if (error.status != 500) {
                if (global.currentAppLanguage != "en" && error.data["messageAr"] != undefined) {
                    alert(error.data["messageAr"]);
                } else {
                    setTimeout(() => {
                        alert(error.data["message"]);
                    }, 200);
                }
            } else {
                constants.debugLog("Internal Server Error: " + error.data);
                alert("Something went wrong, plese try again");
            }
        }
    );

    // Loading View
    import Spinner from "react-native-loading-spinner-overlay";

    // Show Spinner in render()

    <Spinner
        visible={this.state.visible}
        cancelable={true}
        textStyle={{ color: "#FFF" }}
    />

*/
