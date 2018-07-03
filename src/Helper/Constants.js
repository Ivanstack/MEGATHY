// Localization
import baseLocal from "../Resources/Localization/baseLocalization";
import { Dimensions } from "react-native";
var { EventEmitter } = require("fbemitter");

module.exports = {
    /// Screen Width And Height
    scrWidth: Dimensions.get("screen").width,
    scrHeight: Dimensions.get("screen").height,

    /// Other Misc Constants
    alertTitle: "Megathy",
    emitter: new EventEmitter(),
    isLogin: "false",
    loginListener: "loginListener",
    logoutListener: "logoutListener",
    setStoreListener: "setStoreListener",
    languageEnglish: "en",
    languageArabic: "ar",
    DeviceInfo: require("react-native-device-info"),

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
    keyCurrentCartItems: "cartItems",

    //Screen Name Keys
    kCategoryScreen: "CategoryScreen",
    kSubCategoryScreen: "SubCategoryScreen",
    kProductScreen: "ProductScreen",
    kCartScreen: "CartScreen",
    kOrderMasterScreen: "OrderMasterScreen",

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
    APILogin: "userLogin",
    APIRegister: "registerUser",
    APIForgotPassword: "requestForgotPassword",
    APIVerifyFBId: "verifyfacebookId",
    APIGetCity: "getCity",
    APIGetArea: "getArea",
    APIGetStore: "getStore",
    APISetStore: "setStore",
    APIVerifyPhoneCode: "verifyPhoneCode",
    APIRequestVerifyPhones: "requestVerifyPhones",
    APIUpdatePassword: "updatePassword",

    /// Menu Screens
    APIGetCategory: "getCategory",
    APIGetSubCategory: "getSubCategory",
    APIGetBanners: "banners",
    APIGetProductList: "getProduct",
    APIGetStoreTimeZone: "getStoreTimeZone",
    APIGetAddress: "address",
    APIDeleteAddress: "address",
    APIGetOrderTimeSession: "getOrderTimeSession",

    /// Colors
    themeColor: "#CF2526",
    prodCategoryBGColor: "#EFEDE9",
    buttonDisableColor: "#939393",
    darkGrayBGColor: "#D4D4D4",
    themeGreenColor: "#3B7F38",
    themeYellowColor: "#FAC818",
    

    /// Font Family
    themeFont: "Ebrima",

    //Product Key
    kProductDiscountActive: "Active",
    kProductDiscountInactive: "Inactive",
    kProductDiscountType: "fixed",
    kProductDiscountPercentage: "percentage",

    //Product Key
    kProductDiscountActive: "Active",
    kProductDiscountInactive: "Inactive",
    kProductDiscountType: "fixed",
    kProductDiscountPercentage: "percentage",

    actions: {
        /*
        Redux Action Keys Start
        Key formation:
            <API_Name> + <Request|Success|Failure>
        */

        // Login Screen
        FBLoginRequest: "FBLoginRequest",
        loginRequest: "loginRequest",
        loginSuccess: "loginSuccess",
        loginFailure: "loginFailure",

        // Sign Up Screen
        signUpRequest: "signUpRequest",
        signUpSuccess: "signUpSuccess",
        signUpFailure: "signUpFailure",

        // Forgot Password Screen
        forgotPasswordRequest: "forgotPasswordRequest",
        forgotPasswordSuccess: "forgotPasswordSuccess",
        forgotPasswordFailure: "forgotPasswordFailure",

        // Verify Code Screen
        verifyPhoneRequest: "verifyPhoneRequest",
        verifyPhoneSuccess: "verifyPhoneSuccess",
        verifyPhoneFailure: "verifyPhoneFailure",
        verifyCodeRequest: "verifyCodeRequest",
        verifyCodeSuccess: "verifyCodeSuccess",
        verifyCodeFailure: "verifyCodeFailure",

        // Reset Password Screen
        resetPasswordRequest: "resetPasswordRequest",
        resetPasswordSuccess: "resetPasswordSuccess",
        resetPasswordFailure: "resetPasswordFailure",

        // City Screen
        getCityRequest: "getCityRequest",
        getCitySuccess: "getCitySuccess",
        getCityFailure: "getCityFailure",

        // Area Screen
        getAreaRequest: "getAreaRequest",
        getAreaSuccess: "getAreaSuccess",
        getAreaFailure: "getAreaFailure",

        // Store Screen
        getStoreRequest: "getStoreRequest",
        getStoreSuccess: "getStoreSuccess",
        getStoreFailure: "getStoreFailure",
        setStoreRequest: "setStoreRequest",
        setStoreSuccess: "setStoreSuccess",
        setStoreFailure: "setStoreFailure",

        // SelectTime Screen
        getOrderTimeSessionRequest: "getOrderTimeSessionRequest",
        getOrderTimeSessionSuccess: "getOrderTimeSessionSuccess",
        getOrderTimeSessionFailure: "getOrderTimeSessionFailure",

        // Category Screen
        getCategoryRequest: "getCategoryRequest",
        getCategorySuccess: "getCategorySuccess",
        getCategoryFailure: "getCategoryFailure",
        getBannerRequest: "getBannerRequest",
        getBannerSuccess: "getBannerSuccess",
        getBannerFailure: "getBannerFailure",

        // SubCategory Screen
        getSubCategoryRequest: "getSubCategoryRequest",
        getSubCategorySuccess: "getSubCategorySuccess",
        getSubCategoryFailure: "getSubCategoryFailure",
        
        // Product Screen
        getProductRequest: "getProductRequest",
        getProductSuccess: "getProductSuccess",
        getProductFailure: "getProductFailure",

        // AddressList Screen
        getAddressRequest: "getAddressRequest",
        getAddressSuccess: "getAddressSuccess",
        getAddressFailure: "getAddressFailure",
        deleteAddressRequest: "deleteAddressRequest",
        deleteAddressSuccess: "deleteAddressSuccess",
        deleteAddressFailure: "deleteAddressFailure",
    },

    /*
        Redux Action Keys End
    */
};

/*
Network Utility API Call Template

    networkUtility.postRequest(constant.APIForgotPassword, forgotPasswordParameters).then(
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
                    CommonUtilities.showAlert(error.data["messageAr"], false);
                } else {
                    CommonUtilities.showAlert(error.data["message"], false);
                }
            } else {
                constants.debugLog("Internal Server Error: " + error.data);
                CommonUtilities.showAlert("Opps! something went wrong");
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
