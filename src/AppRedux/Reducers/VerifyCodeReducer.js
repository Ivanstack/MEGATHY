import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isVPSuccess: false, // isVerifyPhoneSuccess
    isVCSuccess: false, // isVerifyCodeSuccess
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.verifyCodeRequest:
            return {
                ...state,
                result: null,
                isVCSuccess: false,
                isVPSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.verifyCodeSuccess:
            return {
                ...state,
                result: action.response,
                isVCSuccess: true,
                isVPSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.verifyCodeFailure:
            return {
                ...state,
                result: null,
                isVCSuccess: false,
                isVPSuccess: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.verifyPhoneRequest:
            return {
                ...state,
                result: null,
                isVPSuccess: false,
                isVCSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.verifyPhoneSuccess:
            return {
                ...state,
                result: action.response,
                isVPSuccess: true,
                isVCSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.verifyPhoneFailure:
            return {
                ...state,
                result: null,
                isVPSuccess: false,
                isVCSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
