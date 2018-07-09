import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* SelectTimeScheduleScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetOrderTimeSession) {
        try {
            const response = yield call(getOrderTimeSessionCall, action.payload);
            yield put({ type: constant.actions.getOrderTimeSessionSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getOrderTimeSessionFailure, error });
        }
    }else if (action.payload.endPoint === constant.APISetOrderTimeSession) {
        try {
            const response = yield call(setOrderTimeSessionCall, action.payload);
            yield put({ type: constant.actions.setOrderTimeSessionSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.setOrderTimeSessionFailure, error });
        }
    }
}

getOrderTimeSessionCall = payload => {
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

setOrderTimeSessionCall = payload => {
    return networkUtility.putRequest(payload.endPoint, payload.parameters).then(
        result => {
            AsyncStorage.setItem(constant.keyScheduleOrderParent, result.data.parent);
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
