var { EventEmitter } = require("fbemitter");

module.exports = {
    emitter: new EventEmitter(),
    LOGIN_STATUS: "false",
    LOGOUT_EVENT: "logout",

    // Common API request parameters
    deviceTypeiPhone: "IPHONE",
    deviceTypeAndroid: "ANDROID",
    notifyId: "0123456789",
    timeZone: "Asia/Riyadh",

    // Rest API details
    // Base URL
    baseURL: "http://192.168.0.3/megathylaravel/public/api/v1/", // Jay Kaneriya
    // baseURL: "http://192.168.0.2/MegathyLaravel/public/api/v1/", //Chintan Adatiya

    // End Points
    login: "userLogin",
    register: "registerUser",
    forgotPassword: "requestForgotPassword",
    getCategory: "getCategory?page=1",
    getBanners: "banners",

    // Other Misc Constants
    alertTitle: "Megathy",

    // Colors
    themeColor: "#CF2526",
};
