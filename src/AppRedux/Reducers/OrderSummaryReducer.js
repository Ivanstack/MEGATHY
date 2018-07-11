import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isCheckCoupenSuccess: false,
    isSetOrderSuccess: false,
    objCoupenCode: null,
    objSetOrder: null,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.checkCoupenCodeRequest:
            return {
                ...state,
                isCheckCoupenSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.checkCoupenCodeSuccess:
            return {
                ...state,
                objCoupenCode: action.response,
                isCheckCoupenSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.checkCoupenCodeFailure:
            return {
                ...state,
                isCheckCoupenSuccess: false,
                isLoading: false,
                error: action.error,
            };

        // set order call
        case constant.actions.setOrderRequest:
            return {
                ...state,
                isSetOrderSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.setOrderSuccess:
            return {
                ...state,
                objSetOrder: action.response,
                isSetOrderSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.setOrderFailure:
            return {
                ...state,
                isSetOrderSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
