import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSetTimeSuccess: false,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.setOrderTimeSessionRequest:
            return {
                ...state,
                isSetTimeSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.setOrderTimeSessionSuccess:
            return {
                ...state,
                isSetTimeSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.setOrderTimeSessionFailure:
            return {
                ...state,
                isSetTimeSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
