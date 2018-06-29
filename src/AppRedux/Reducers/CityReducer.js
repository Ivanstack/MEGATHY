import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSuccess: false,
    arrCities: [],
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getCityRequest:
            return {
                ...state,
                isSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getCitySuccess:
            return {
                ...state,
                arrCities: action.response,
                isSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getCityFailure:
            return {
                ...state,
                isSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
