import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* AddressListScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetAddress) {
        try {
            const response = yield call(getAddressCall, action.payload);
            yield put({ type: constant.actions.getAddressSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getAddressFailure, error });
        }
    } else if (action.payload.endPoint.includes(constant.APIDeleteAddress)) {
        try {
            const response = yield call(deleteAddressCall, action.payload);
            yield put({ type: constant.actions.deleteAddressSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.deleteAddressFailure, error });
        }
    }
}

getAddressCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters).then(
        result => {
            if (result.data.data.current_page === 1) {
                result.data.data.data.map((value, index) => {
                    if (index === 0) {
                        value.selected = true;
                    }
                });
            }
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

deleteAddressCall = payload => {
    return networkUtility.deleteRequest(payload.endPoint, payload.parameters).then(
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
