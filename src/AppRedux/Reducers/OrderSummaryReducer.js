import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isCheckCoupenSuccess: false,
    isCheckCoupenSuccess: false,
    arrStores:[],
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getStoreRequest:
            return {
                ...state,
                isGetStoreSuccess: false,
                isSetStoreSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getStoreSuccess:
            return {
                ...state,
                arrStores: action.response,
                isGetStoreSuccess: true,
                isSetStoreSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getStoreFailure:
            return {
                ...state,
                isGetStoreSuccess: false,
                isSetStoreSuccess: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.setStoreRequest:
            return {
                ...state,
                isGetStoreSuccess: false,
                isSetStoreSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.setStoreSuccess:
            return {
                ...state,
                isGetStoreSuccess: false,
                isSetStoreSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.setStoreFailure:
            return {
                ...state,
                isGetStoreSuccess: false,
                isSetStoreSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
