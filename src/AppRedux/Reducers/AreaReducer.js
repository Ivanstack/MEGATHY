import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSuccess: false,
    arrAreas: [],
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getAreaRequest:
            return {
                ...state,
                isSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getAreaSuccess:
            return {
                ...state,
                arrAreas: action.response,
                isSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getAreaFailure:
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
