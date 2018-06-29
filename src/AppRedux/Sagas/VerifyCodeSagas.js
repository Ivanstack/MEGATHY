import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* VerifyCodeScreenCalls(action) {
    if (action.payload.endPoint === constant.APIRequestVerifyPhones) {
        try {
            const response = yield call(verifyPhoneCall, action.payload);
            yield put({ type: constant.actions.verifyPhoneSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.verifyPhoneFailure, error });
        }
    } else if (action.payload.endPoint === constant.APIVerifyPhoneCode) {
        try {
            const response = yield call(verifyCodeCall, action.payload);
            yield put({ type: constant.actions.verifyCodeSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.verifyCodeFailure, error });
        }
    }
}

verifyPhoneCall = payload => {
    return networkUtility.postRequest(payload.endPoint, payload.parameters).then(
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
            return error;
        }
    );
};

verifyCodeCall = payload => {
    return networkUtility.postRequest(payload.endPoint, payload.parameters).then(
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
            return error;
        }
    );
};
