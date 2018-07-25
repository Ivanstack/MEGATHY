import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshing: false,
    isSuccess: false,
    arrScheduleOrderHistory: [],
    currentPage: 1,
    lastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getScheduleOrderListRequest:
            return {
                ...state,
                isSuccess: false,
                isRefreshing: true,
                isLoading: true,
                error: null,
            };
        case constant.actions.getScheduleOrderListSuccess:
            return {
                ...state,
                arrScheduleOrderHistory:
                    action.response.current_page === 1
                        ? action.response.data
                        : [...state.arrScheduleOrderHistory, ...action.response.data],
                currentPage: action.response.current_page,
                lastPage: action.response.last_page,
                isSuccess: true,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getScheduleOrderListFailure:
            return {
                ...state,
                isSuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
