import { AsyncStorage, Platform } from "react-native";
import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

// FBSDK
const FBSDK = require("react-native-fbsdk");
const { LoginManager, GraphRequest, GraphRequestManager, AccessToken } = FBSDK;

export function* LoginScreenCalls(action) {
    if (action.payload.endPoint === constant.APILogin) {
        try {
            const response = yield call(loginWithEmail, action.payload);
            yield put({ type: "LOGIN_CALL_SUCCESS", response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: "LOGIN_CALL_FAILURE", error });
        }
    } else if (action.payload.endPoint === constant.APIVerifyFBId) {
        try {
            const response = yield call(loginWithFB);
            yield put({ type: "LOGIN_CALL_SUCCESS", response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: "LOGIN_CALL_FAILURE", error });
        }
    }
}

loginWithEmail = payload => {
    return networkUtility.postRequest(payload.endPoint, payload.parameters).then(
        result => {
            global.currentUser = result.data.data.userData;
            AsyncStorage.setItem(constant.keyCurrentUser, JSON.stringify(result.data.data.userData));
            AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data.settingData));
            AsyncStorage.removeItem(constant.keyCurrentStore);
            constant.debugLog("User Login Success");
            return result;
        },
        error => {
            constant.debugLog("Status Code: " + error.status);
            constant.debugLog("Error Message: " + error.message);
            if (error.status != 500) {
                if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                    CommonUtilities.showAlert(error.data["messageAr"], false);
                } else {
                    CommonUtilities.showAlert(error.data["message"], false);
                }
            } else {
                constant.debugLog("Internal Server Error: " + error.data);
                CommonUtilities.showAlert("Opps! something went wrong");
            }
            throw error;
        }
    );
};

loginWithFB = () => {
    return LoginManager.logInWithReadPermissions(["public_profile"]).then(
        result => {
            if (result.isCancelled) {
                CommonUtilities.showAlert("Login cancelled", false);
                throw result;
            } else {
                AccessToken.getCurrentAccessToken().then(data => {
                    let accessToken = data.accessToken;
                    const infoRequest = new GraphRequest(
                        "/me",
                        {
                            accessToken: accessToken,
                            parameters: {
                                fields: {
                                    string: "email,name,first_name,middle_name,last_name",
                                },
                            },
                        },
                        this.checkFBIdExistance
                    );

                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start();
                });
            }
        },
        error => {
            CommonUtilities.showAlert("Login fail with error: " + error, false);
        }
    );
};

checkFBIdExistance = (error, fbResult) => {
    if (error) {
        constant.debugLog(error);
        CommonUtilities.showAlert("Error fetching data: " + error.toString(), false);
        throw error;
    } else {
        constant.debugLog(fbResult);
        var checkFBIdParameters = {
            facebookId: fbResult["id"],
            deviceType: Platform.OS === "ios" ? constant.deviceTypeiPhone : constant.deviceTypeAndroid,
            notifyId: constant.notifyId,
            timeZone: constant.timeZone,
            appVersion: constant.DeviceInfo.appVersion === undefined ? "0.0" : constant.DeviceInfo.appVersion,
        };

        return networkUtility.postRequest(constant.APIVerifyFBId, checkFBIdParameters).then(
            result => {
                if (result.status == 206) {
                    this.props.navigation.navigate("SignUpScreen", { fbResult: fbResult });
                } else {
                    global.loginKey = result.data.data.userData.loginKey;
                    AsyncStorage.setItem(constant.keyCurrentUser, JSON.stringify(result.data.data.userData));
                    AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data.settingData));
                    AsyncStorage.removeItem(constant.keyCurrentStore);
                    constant.debugLog("FB User Login Success");
                    this.props.navigation.navigate("CityScreen");
                    return result;
                }
            },
            error => {
                constant.debugLog("Status Code: " + error.status);
                constant.debugLog("Error Message: " + error.message);
                if (error.status != 500) {
                    if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                        CommonUtilities.showAlert(error.data["messageAr"], false);
                    } else {
                        CommonUtilities.showAlert(error.data["message"], false);
                    }
                } else {
                    constant.debugLog("Internal Server Error: " + error.data);
                    CommonUtilities.showAlert("Opps! something went wrong");
                }
                throw error;
            }
        );
    }
};
