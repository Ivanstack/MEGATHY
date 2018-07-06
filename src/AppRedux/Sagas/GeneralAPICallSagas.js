import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* GeneralAPICallSagas(action) {
    if (action.payload.endPoint === constant.APIGetAppSettingsAndRewards) {
        try {
            const response = yield call(getAppSettingsAndRewardsCall, action.payload);
            yield put({ type: constant.actions.getAppSettingAndRewardPointSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getAppSettingAndRewardPointFailure, error });
        }
    } else if (action.payload.endPoint === constant.APIGetStoreTimeZone) {
        try {
            const response = yield call(getStoreTimezoneCall, action.payload);
            yield put({ type: constant.actions.getStoreTimezoneSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getStoreTimezoneFailure, error });
        }
    }
}

getAppSettingsAndRewardsCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
        result => {
            global.currentSettings = result.data.data;
            AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data));
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
            throw error;
        }
    );
};

getStoreTimezoneCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
        result => {
            return result.data.data.storeTime;
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
