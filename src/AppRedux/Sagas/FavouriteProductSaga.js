import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* FavouriteScreenCalls(action) {
    if (action.payload.endPoint === constant.APIGetFavouriteProducts) {
        try {
            const response = yield call(getFavouriteProductCall, action.payload);
            yield put({ type: constant.actions.getFavouriteProductSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.getProductFailure, error });
        }
    }
    else if (action.payload.endPoint.includes(constant.APIRemoveFavouriteProduct)) {
        try {
            const response = yield call(removeFavouriteProductCall, action.payload);
            yield put({ type: constant.actions.removeFavouriteProductSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.removeFavouriteProductFailure, error });
        }
    }
    else  if (action.payload.endPoint === constant.APIAddFavouriteProduct) {
        try {
            const response = yield call(addFavouriteProductCall, action.payload);
            yield put({ type: constant.actions.addFavouriteProductSuccess, response });
        } catch (error) {
            constant.debugLog("Error: " + JSON.stringify(error));
            yield put({ type: constant.actions.addFavouriteProductFailure, error });
        }
    }
}

getFavouriteProductCall = payload => {
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

removeFavouriteProductCall = payload => {
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
            throw error;
        }
    );
};

addFavouriteProductCall = payload => {
    return networkUtility.requestWithUrl(payload.endPoint, payload.parameters).then(
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