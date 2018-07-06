import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSettingsSuccess: false,
    isStoreTimeSuccess: false,
    storeDate: "",
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getAppSettingAndRewardPointRequest:
            return {
                ...state,
                isSettingsSuccess: false,
                isStoreTimeSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getAppSettingAndRewardPointSuccess:
            return {
                ...state,
                isSettingsSuccess: true,
                isStoreTimeSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getAppSettingAndRewardPointFailure:
            return {
                ...state,
                isSettingsSuccess: false,
                isStoreTimeSuccess: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.getStoreTimezoneRequest:
            return {
                ...state,
                isSettingsSuccess: false,
                isStoreTimeSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getStoreTimezoneSuccess:
            return {
                ...state,
                storeDate: action.response,
                isSettingsSuccess: false,
                isStoreTimeSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getStoreTimezoneFailure:
            return {
                ...state,
                isSettingsSuccess: false,
                isStoreTimeSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
