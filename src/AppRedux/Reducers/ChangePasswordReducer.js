import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    // isVPSuccess: false, // isVerifyPhoneSuccess
    // isVCSuccess: false, // isVerifyCodeSuccess
    // result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.changePasswordRequest:
            return {
                ...state,
                // result: null,
                // isVCSuccess: false,
                // isVPSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.changePasswordSuccess:
            return {
                ...state,
                // result: action.response,
                // isVCSuccess: true,
                // isVPSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.changePasswordFailure:
            return {
                ...state,
                // result: null,
                // isVCSuccess: false,
                // isVPSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
