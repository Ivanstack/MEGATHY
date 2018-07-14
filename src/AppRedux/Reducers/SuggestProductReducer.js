import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSuccess: false,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.suggestProductRequest:
            return {
                ...state,
                isSuccess: false,
                isLoading: true,
            };
        case constant.actions.suggestProductSuccess:
            return {
                ...state,
                isSuccess: true,
                isLoading: false,
            };
        case constant.actions.suggestProductFailure:
            return {
                ...state,
                isSuccess: false,
                isLoading: false,
            };
        default:
            return state;
    }
};
