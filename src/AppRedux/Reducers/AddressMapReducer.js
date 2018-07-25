import * as constant from "../../Helper/Constants";
// reducer with initial state
export const initialState = {
    isAutoCompleteSuccess: false,
    isPlaceDetailSuccess: false,
    isGeoCodeSuccess: false,
    resultAutoComplete: [],
    resultPlaceDetail: undefined,
    resultGeoCode: undefined,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.placeAutocompleteRequest:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                error: null,
            };
        case constant.actions.placeAutocompleteSuccess:
            return {
                ...state,
                isAutoCompleteSuccess: true,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                resultAutoComplete: action.response,
                error: null,
            };
        case constant.actions.placeAutocompleteFailure:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                error: action.error,
            };
        case constant.actions.placeDetailRequest:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                error: null,
            };
        case constant.actions.placeDetailSuccess:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: true,
                isGeoCodeSuccess: false,
                resultPlaceDetail: action.response,
                error: null,
            };
        case constant.actions.placeDetailFailure:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                error: action.error,
            };
        case constant.actions.geoCodeRequest:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                error: null,
            };
        case constant.actions.geoCodeSuccess:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: true,
                resultGeoCode: action.response,
                error: null,
            };
        case constant.actions.geoCodeFailure:
            return {
                ...state,
                isAutoCompleteSuccess: false,
                isPlaceDetailSuccess: false,
                isGeoCodeSuccess: false,
                error: action.error,
            };
        default:
            return state;
    }
};
