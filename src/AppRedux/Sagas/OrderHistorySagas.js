import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* OrderHistoryScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetOrderHistory) {
        try {
            const response = yield call(getOrderHistoryCall, action.payload);
            yield put({ type: constant.actions.getOrderHistorySuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getOrderHistoryFailure, error });
        }
    }
}

getOrderHistoryCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
        result => {
            // constant.debugLog("Get Order History Response: " + JSON.stringify(result.data));
            return result.data;
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

