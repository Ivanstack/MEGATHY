import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* WalletScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetRewardHistory) {
        try {
            const response = yield call(getWalletHistoryCall, action.payload);
            yield put({ type: constant.actions.getWalletHistorySuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getWalletHistoryFailure, error });
        }
    }
}

getWalletHistoryCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
        result => {
            let responseData = {};
            responseData["data"] = result.data.data;
            if (result.request.responseURL.includes(constant.kWalletTypeAll)) {
                responseData["currentType"] = constant.kWalletTypeAll;
            } else if (result.request.responseURL.includes(constant.kWalletTypeRedeemed)) {
                responseData["currentType"] = constant.kWalletTypeRedeemed;
            } else {
                responseData["currentType"] = constant.kWalletTypeCollected;
            }
            return responseData;
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
