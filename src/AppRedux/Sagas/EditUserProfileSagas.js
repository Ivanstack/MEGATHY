import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* UpdateUserProfileScreenCalls(action) {
    if (action.payload.endPoint === constant.APIForgotPassword) {
        try {
            const response = yield call(updateUserProfileCall, action.payload);
            yield put({ type: constant.actions.updateUserProfileSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.updateUserProfileFailure, error });
        }
    }
}

updateUserProfileCall = payload => {
    return networkUtility.putRequest(payload.endPoint, payload.parameters).then(
        result => {
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
