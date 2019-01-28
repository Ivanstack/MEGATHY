
import { AsyncStorage, Platform } from "react-native";
import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";



export function* LogoutScreenCalls(action) {
    try {
        const response = yield call(logoutWithEmail, action.payload);
        yield put({ type: constant.actions.logOutSuccess, response });
    } catch (error) {
        constant.debugLog("Error: " + JSON.stringify(error));
        yield put({ type: constant.actions.logOutFailure, error });
    }
}


logoutWithEmail = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
        result => {
            constant.debugLog("User Logout Success");
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
}