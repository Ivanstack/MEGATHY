
var axios = require("axios");
var DeviceInfo = require("react-native-device-info");

export function setDefaultAPIConfig(){
    let axiosDefaults = require("axios/lib/defaults");
    axiosDefaults.baseURL = "http://192.168.0.3/megathylaravel/public/api/v1/";
    axiosDefaults.timeout = 60000;
    axiosDefaults.headers = {
        Authorization: global.loginKey === null ? "" : global.loginKey,
        "Accept-Language": global.currentAppLanguage,
        AppVersion: DeviceInfo.AppVersion,
        "User-Agent": DeviceInfo.getUserAgent.name,
    };
};

export function makeHTTPRequest(httpMethod){
    setDefaultAPIConfig()
    
}
