import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* GeneralAPICallSagas(action) {
    if (action.payload.endPoint === constant.APIGetAppSettingsAndRewards, action.payload) {
        try {
            const response = yield call(getAppSettingsAndRewards, action.payload);
            yield put({ type: constant.actions.getAppSettingAndRewardPointSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getAppSettingAndRewardPointFailure, error });
        }
    }
}

getAppSettingsAndRewards = (payload)=> {
    return networkUtility.getRequest(payload.endPoint,payload.parameters).then(
        result => {
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
