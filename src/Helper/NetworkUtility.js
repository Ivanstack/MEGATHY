import * as constants from "./Constants";
import { AsyncStorage } from "react-native";
import * as CommonUtilities from "./CommonUtilities";
var axios = require("axios");
var axiosDefaults = require("axios/lib/defaults");
var DeviceInfo = require("react-native-device-info");

export function setDefaultAPIConfig() {
    axiosDefaults.baseURL = constants.baseURL;
    axiosDefaults.timeout = 60000;
    axiosDefaults.headers = {
        Authorization: global.currentUser === null ? "" : global.currentUser.loginKey,
        "Accept-Language": global.currentAppLanguage,
        AppVersion: DeviceInfo.getVersion(),
        "User-Agent": DeviceInfo.getUserAgent(),
    };
}

export function getRequest(endPoint, parameters = "", url="") {
    setDefaultAPIConfig();
    if(url != ""){
        axiosDefaults.baseURL = url;
    }

    if (parameters.storeId === undefined && global.currentStore != null) {
        if (parameters === "") {
            parameters = {
                storeId: global.currentStore.storeId,
            };
        } else {
            parameters["storeId"] = global.currentStore.storeId;
        }
    }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Get");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults.headers));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .get(endPoint, {
                params: parameters === undefined || parameters === null ? "" : parameters,
            })
            .then(function(response) {
                constants.debugLog(response);
                resolve(response);
            })
            .catch(function(error) {
                constants.debugLog(error)
                let errorResponse = ""
                if(error.message === "Network Error"){
                    CommonUtilities.showNetworkAlert()
                }else if (error.response.status === 403) {
                    CommonUtilities.logout(false)
                } else {
                    errorResponse = error.response
                }
                reject(error.response);
            });
    });
}

export function postRequestWithFormData(endPoint,parameters = "") {
    axiosDefaults.baseURL = constants.baseURL;
    axiosDefaults.timeout = 60000;
    axiosDefaults.headers = {
        Authorization: global.currentUser === null ? "" : global.currentUser.loginKey,
        "Accept-Language": global.currentAppLanguage,
        AppVersion: DeviceInfo.getVersion(),
        "User-Agent": DeviceInfo.getUserAgent(),
        "Content-Type" : "multipart/form-data;",
        "Accept" : "application/json",
    };
    // if (parameters.storeId === undefined && global.currentStore != null) {
    //     if (parameters === "") {
    //         parameters = {
    //             storeId: global.currentStore.storeId,
    //         };
    //     } else {
    //         parameters["storeId"] = global.currentStore.storeId;
    //     }
    // }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Post");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults.headers));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .post(endPoint, parameters)
            .then(response => {
                constants.debugLog(response);
                resolve(response);
            })
            .catch(error => {
                constants.debugLog(error)
                let errorResponse = ""
                if(error.message === "Network Error"){
                    CommonUtilities.showNetworkAlert()
                }else if (error.response.status === 403) {
                    CommonUtilities.logout(false)
                } else {
                    errorResponse = error.response
                }
                reject(error.response);
            });
    });
}


export function postRequest(endPoint, parameters = "") {
    setDefaultAPIConfig();

    if (parameters.storeId === undefined && global.currentStore != null) {
        if (parameters === "") {
            parameters = {
                storeId: global.currentStore.storeId,
            };
        } else {
            parameters["storeId"] = global.currentStore.storeId;
        }
    }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Post");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults.headers));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .post(endPoint, parameters)
            .then(response => {
                constants.debugLog(response);
                resolve(response);
            })
            .catch(error => {
                constants.debugLog(error)
                let errorResponse = ""
                if(error.message === "Network Error"){
                    CommonUtilities.showNetworkAlert()
                }else if (error.response.status === 403) {
                    CommonUtilities.logout(false)
                } else {
                    errorResponse = error.response
                }
                reject(error.response);
            });
    });
}

export function putRequest(endPoint, parameters = "") {
    setDefaultAPIConfig();

    if (parameters.storeId === undefined && global.currentStore != null) {
        if (parameters === "") {
            parameters = {
                storeId: global.currentStore.storeId,
            };
        } else {
            parameters["storeId"] = global.currentStore.storeId;
        }
    }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Post");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults.headers));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .put(endPoint, parameters)
            .then(response => {
                constants.debugLog(response);
                resolve(response);
            })
            .catch(error => {
                constants.debugLog(error)
                let errorResponse = ""
                if(error.message === "Network Error"){
                    CommonUtilities.showNetworkAlert()
                }else if (error.response.status === 403) {
                    CommonUtilities.logout(false)
                } else {
                    errorResponse = error.response
                }
                reject(error.response);
            });
    });
}

export function deleteRequest(endPoint, parameters = "") {
    setDefaultAPIConfig();

    if (parameters.storeId === undefined && global.currentStore != null) {
        if (parameters === "") {
            parameters = {
                storeId: global.currentStore.storeId,
            };
        } else {
            parameters["storeId"] = global.currentStore.storeId;
        }
    }

    console.log("\n\n ================>");
    console.log("\n HTTP Method: Post");
    console.log("\n Request for URL: " + constants.baseURL);
    console.log("\n Endpoint: " + endPoint);
    console.log("\n Parameters: " + JSON.stringify(parameters));
    console.log("\n Headers: " + JSON.stringify(axiosDefaults.headers));
    console.log("<================\n\n");

    return new Promise((resolve, reject) => {
        axios
            .delete(endPoint, parameters)
            .then(response => {
                constants.debugLog(response);
                resolve(response);
            })
            .catch(error => {
                constants.debugLog(error)
                let errorResponse = ""
                if(error.message === "Network Error"){
                    CommonUtilities.showNetworkAlert()
                }else if (error.response.status === 403) {
                    CommonUtilities.logout(false)
                } else {
                    errorResponse = error.response
                }
                reject(error.response);
            });
    });
}
