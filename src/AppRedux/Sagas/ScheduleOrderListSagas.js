import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* ScheduleOrderListScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetScheduleOrderHistory) {
        try {
            const response = yield call(getScheduleOrderHistoryCall, action.payload);
            yield put({ type: constant.actions.getScheduleOrderListSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getScheduleOrderListFailure, error });
        }
    }else if (action.payload.endPoint === constant.APIUpdateScheduleOrderStatus) {
        try {
            const response = yield call(updateScheduleOrderStatusCall, action.payload);
            yield put({ type: constant.actions.updateScheduleOrderStatusSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.updateScheduleOrderStatusFailure, error });
        }
    }
}

getScheduleOrderHistoryCall = payload => {
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

updateScheduleOrderStatusCall = payload => {
    return networkUtility.putRequest(payload.endPoint, payload.parameters).then(
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
