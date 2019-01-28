import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    searchedData:[],
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.seachAllProductsRequest:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case constant.actions.seachAllProductsSuccess:
            return {
                ...state,
                isLoading: false,
                searchedData:action.response.data,
                error: null,
            };
        case constant.actions.seachAllProductsFailure:
            return {
                ...state,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
