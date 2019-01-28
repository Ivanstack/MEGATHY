
import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.logOutRequest:
            return {
                ...state,
                isLoading: true,
                result: null,
                error: null,
            };
        case constant.actions.logOutSuccess:
            return {
                ...state,
                isLoading: false,
                result: action.response,
                error: null,
            };
        case constant.actions.logOutFailure:
            return {
                ...state,
                isLoading: false,
                result: null,
                error: action.error,
            };
        default:
            return state;
    }
};
