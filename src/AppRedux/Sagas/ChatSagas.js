import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* ChatScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetChat) {
        try {
            const response = yield call(getChatCall, action.payload);
            yield put({ type: constant.actions.getChatSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getChatFailure, error });
        }
    } else if (action.payload.endPoint === constant.APISendMessage) {
        try {
            const response = yield call(sendMessageCall, action.payload);
            yield put({ type: constant.actions.sendMessageSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.sendMessageFailure, error });
        }
    }
}

getChatCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
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
            throw error;
        }
    );
};

sendMessageCall = payload => {
    return networkUtility.postRequestWithFormData(payload.endPoint, payload.parameters).then(
        result => {
            constant.debugLog("Chat Response: " + JSON.stringify(result.data.data));
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
