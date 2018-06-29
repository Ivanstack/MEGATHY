import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSignUp: false,
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.signUpRequest:
            return {
                ...state,
                isSignUp: false,
                isLoading: true,
                result: null,
                error: null,
            };
        case constant.actions.signUpSuccess:
            return {
                ...state,
                isSignUp: true,
                isLoading: false,
                result: action.response,
                error: null,
            };
        case constant.actions.signUpFailure:
            return {
                ...state,
                isSignUp: false,
                isLoading: false,
                result: null,
                error: action.error,
            };
        default:
            return state;
    }
};
