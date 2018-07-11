import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* OrderSummaryScreenCalls(action) {
    if (action.payload.endPoint === constant.APICheckCoupenCode) {
        try {
            const response = yield call(checkCoupenCodeCall, action.payload);
            constant.debugLog("Check Coupen response: " + JSON.stringify(response));
            yield put({ type: constant.actions.checkCoupenCodeSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.checkCoupenCodeFailure, error });
        }
    } else if (action.payload.endPoint === constant.APISetOrder) {
        try {
            const response = yield call(setOrderCall, action.payload);
            yield put({ type: constant.actions.setOrderSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.setOrderFailure, error });
        }
    }
}

checkCoupenCodeCall = payload => {
    return networkUtility.putRequest(payload.endPoint, payload.parameters).then(
        result => {
            constant.debugLog("Coupen Code Response: " + JSON.stringify(result.data.data));
            return result.data.data;
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

setOrderCall = payload => {
    return networkUtility.putRequest(payload.endPoint, payload.parameters).then(
        result => {
            constant.debugLog("Coupen Code Response: " + JSON.stringify(result.data.data));
            return result.data.data;
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
