import constants from "./Constants";
import { AsyncStorage } from "react-native";
var axios = require("axios");
var axiosDefaults = require("axios/lib/defaults");
var DeviceInfo = require("react-native-device-info");

export function setDefaultAPIConfig() {
    axiosDefaults.baseURL = constants.baseURL;
    axiosDefaults.timeout = 60000;
    axiosDefaults.headers = {
        Authorization: global.loginKey === null ? "" : global.loginKey,
        "Accept-Language": global.currentAppLanguage,
        AppVersion: DeviceInfo.AppVersion,
        "User-Agent": DeviceInfo.getUserAgent.name,
    };
    // ValidityState = status => {
    //     return status >= 200 && status < 300;
    // };
}

export function getRequest(endPoint, parameters) {
    setDefaultAPIConfig();

    if(parameters.storeId === undefined && global.currentStore != null){
        parameters["storeId"] = global.currentStore.storeId
    }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Get");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .get(endPoint, {
                params: parameters === undefined || parameters === null ? "" : parameters,
            })
            .then(function(response) {
                console.log(response);
                resolve(response);
            })
            .catch(function(error) {
                console.log(error);
                reject(error.response);
            });
    });
}

export function postRequest(endPoint, parameters) {
    setDefaultAPIConfig();

    if(parameters.storeId === undefined && global.currentStore != null){
        parameters["storeId"] = global.currentStore.storeId
    }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Post");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .post(endPoint, parameters)
            .then(response => {
                console.log(response);
                resolve(response);
            })
            .catch(error => {
                console.log(error.response);
                reject(error.response);
            });
    });
}
