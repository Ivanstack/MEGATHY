import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import * as constant from "../../Helper/Constants";
import * as networkUtility from "../../Helper/NetworkUtility";
import * as CommonUtilities from "../../Helper/CommonUtilities";

export function* AddressMapScreenCalls(action) {
    if (action.payload.url === undefined) {
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
    } else {
        if (action.payload.url === constant.APIPlaceAutoComplete) {
            try {
                const response = yield call(placeAutoCompleteCall, action.payload);
                yield put({ type: constant.actions.placeAutocompleteSuccess, response });
            } catch (error) {
                constant.debugLog("Error: " + JSON.stringify(error));
                yield put({ type: constant.actions.placeAutocompleteFailure, error });
            }
        } else if (action.payload.url === constant.APIPlaceDetail) {
            try {
                const response = yield call(placeDetailCall, action.payload);
                yield put({ type: constant.actions.placeDetailSuccess, response });
            } catch (error) {
                constant.debugLog("Error: " + JSON.stringify(error));
                yield put({ type: constant.actions.placeDetailFailure, error });
            }
        } else if (action.payload.url === constant.APIGeoCode) {
            try {
                const response = yield call(geoCodeCall, action.payload);
                yield put({ type: constant.actions.geoCodeSuccess, response });
            } catch (error) {
                constant.debugLog("Error: " + JSON.stringify(error));
                yield put({ type: constant.actions.geoCodeFailure, error });
            }
        }
    }
}

placeAutoCompleteCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters, payload.url).then(
        result => {
            constant.debugLog(result.data.status);
            return result.data.predictions === undefined ? [] : result.data.predictions;
        },
        error => {
            constant.debugLog("Status Code: " + error.status);
            constant.debugLog("Error Message: " + error.message);
            throw error;
        }
    );
};

placeDetailCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters, payload.url).then(
        result => {
            constant.debugLog(result.data.status);
            return result.data.result;
        },
        error => {
            constant.debugLog("Status Code: " + error.status);
            constant.debugLog("Error Message: " + error.message);
            throw error;
        }
    );
};

geoCodeCall = payload => {
    return networkUtility.getRequest(payload.endPoint, payload.parameters, payload.url).then(
        result => {
            constant.debugLog(result.data.status);
            return result.data.results;
        },
        error => {
            constant.debugLog("Status Code: " + error.status);
            constant.debugLog("Error Message: " + error.message);
            throw error;
        }
    );
};
