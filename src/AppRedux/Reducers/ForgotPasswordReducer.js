import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isFPSuccess: false,
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.forgotPasswordRequest:
            return {
                ...state,
                result: null,
                isFPSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.forgotPasswordSuccess:
            return {
                ...state,
                result: action.response,
                isFPSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.forgotPasswordFailure:
            return {
                ...state,
                result: null,
                isFPSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
