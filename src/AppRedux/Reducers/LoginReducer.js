import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isLogin: false,
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.loginRequest:
            return {
                ...state,
                isLogin: false,
                isLoading: true,
                result: null,
                error: null,
            };
        case constant.actions.FBLoginRequest:
            return {
                ...state,
                isLogin: false,
                isLoading: true,
                result: null,
                error: null,
            };
        case constant.actions.loginSuccess:
            return {
                ...state,
                isLogin: true,
                isLoading: false,
                result: action.response,
                error: null,
            };
        case constant.actions.loginFailure:
            return {
                ...state,
                isLogin: false,
                isLoading: false,
                result: null,
                error: action.error,
            };
        default:
            return state;
    }
};
