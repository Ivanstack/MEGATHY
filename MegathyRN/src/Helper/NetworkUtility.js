var axios = require("axios");
var DeviceInfo = require("react-native-device-info");
import constants from "./Constants";

export function setDefaultAPIConfig() {
    let axiosDefaults = require("axios/lib/defaults");
    axiosDefaults.baseURL = constants.baseURL;
    axiosDefaults.timeout = 60000;
    axiosDefaults.headers = {
        Authorization: global.loginKey === null ? "" : global.loginKey,
        "Accept-Language": global.currentAppLanguage,
        AppVersion: DeviceInfo.AppVersion,
        "User-Agent": DeviceInfo.getUserAgent.name,
    };
}

export function getRequest(endPoint, parameters) {
    setDefaultAPIConfig();

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Get");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + parameters.stringify);
    console.log("<================\n\n");

    axios
        .get(endPoint, {
            params: JSON.stringify(parameters),
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
}

export function postRequest(endPoint, parameters) {
    setDefaultAPIConfig();

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Post");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("<================\n\n");

    return axios
        .post(endPoint, parameters)
        .then(response => {
            console.log(response);
            return response;
        })
        .catch(error => {
            console.log(error);
            return error;
        });
}
