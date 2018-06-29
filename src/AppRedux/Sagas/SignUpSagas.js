import { AsyncStorage, Platform } from "react-native";
import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* SignUpScreenCalls(action) {
    if (action.payload.endPoint === constant.APIRegister) {
        try {
            const response = yield call(signUpCall, action.payload);
            yield put({ type: constant.actions.signUpSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.signUpFailure, error });
        }
    }
}

signUpCall = payload => {
    return networkUtility.postRequest(payload.endPoint, payload.parameters).then(
        result => {
            global.loginKey = result.data.data.userData.loginKey;
            AsyncStorage.setItem(constant.keyCurrentUser, JSON.stringify(result.data.data.userData));
            AsyncStorage.setItem(constant.keyCurrentSettings, JSON.stringify(result.data.data.settingData));
            AsyncStorage.removeItem(constant.keyCurrentStore);
            constant.debugLog("User Signup Success");
            return result
        },
        error => {
            constant.debugLog("Status Code: " + error.status);
            constant.debugLog("Error Message: " + error.message);
            if (error.status != 500) {
                if (global.currentAppLanguage === constant.languageArabic && error.data["messageAr"] != undefined) {
                    CommonUtilities.showAlert(error.data["messageAr"], false)
                } else {
                        CommonUtilities.showAlert(error.data["message"], false)
                }
            } else {
                constant.debugLog("Internal Server Error: " + error.data);
                CommonUtilities.showAlert('Opps! something went wrong')
            }
            throw error
        }
    );
};
