import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSuccess: false,
    isSetTimeSuccess: false,
    objOrderBookedTimeSlote: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getOrderTimeSessionRequest:
            return {
                ...state,
                isSuccess: false,
                isSetTimeSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getOrderTimeSessionSuccess:
            return {
                ...state,
                objOrderBookedTimeSlote: action.response,
                isSuccess: true,
                isSetTimeSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getOrderTimeSessionFailure:
            return {
                ...state,
                isSuccess: false,
                isSetTimeSuccess: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.setOrderTimeSessionRequest:
            return {
                ...state,
                isSuccess: false,
                isSetTimeSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.setOrderTimeSessionSuccess:
            return {
                ...state,
                isSuccess: false,
                isSetTimeSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.setOrderTimeSessionFailure:
            return {
                ...state,
                isSuccess: false,
                isSetTimeSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
