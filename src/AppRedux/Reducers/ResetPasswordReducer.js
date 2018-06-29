import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRPSuccess: false, // isResetPasswordSuccess
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.resetPasswordRequest:
            return { ...state, result: null, isRPSuccess: false, isLoading: true };
        case constant.actions.resetPasswordSuccess:
            return { ...state, result: action.response, isRPSuccess: true, isLoading: false };
        case constant.actions.resetPasswordFailure:
            return { ...state, result: null, isRPSuccess: false, isLoading: false };
        default:
            return state;
    }
};
