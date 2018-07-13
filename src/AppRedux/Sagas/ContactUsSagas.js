import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* ContactUsScreenCalls(action) {
    if (action.payload.endPoint === constant.APIContactUs) {
        try {
            const response = yield call(contactUsCall, action.payload);
            yield put({ type: constant.actions.contactUsSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.contactUsFailure, error });
        }
    }
}

contactUsCall = payload => {
    return networkUtility.postRequest(payload.endPoint, payload.parameters).then(
        result => {
            CommonUtilities.showAlert(result.data.message, false)
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
