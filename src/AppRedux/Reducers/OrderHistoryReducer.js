import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshing: false,
    isOrderHistorySuccess: false,
    arrOrderHistory: [],
    currentPage: 1,
    lastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getOrderHistoryRequest:
            return {
                ...state,
                isOrderHistorySuccess: false,
                isRefreshing: true,
                isLoading: true,
                error: null,
            };
        case constant.actions.getOrderHistorySuccess:
            return {
                ...state,
                arrOrderHistory:
                    action.response.current_page === 1
                        ? action.response.data
                        : [...state.arrOrderHistory, ...action.response.data],
                currentPage: action.response.current_page,
                lastPage: action.response.last_page,
                isOrderHistorySuccess: true,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getOrderHistoryFailure:
            return {
                ...state,
                isOrderHistorySuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
