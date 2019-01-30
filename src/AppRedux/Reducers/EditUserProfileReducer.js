import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    result: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.updateUserProfileRequest:
            return {
                ...state,
                result: null,
                isLoading: true,
                error: null,
            };
        case constant.actions.updateUserProfileSuccess:
            return {
                ...state,
                result: action.response,
                isLoading: false,
                error: null,
            };
        case constant.actions.updateUserProfileFailure:
            return {
                ...state,
                result: null,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
