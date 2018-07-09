import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSuccess: false,
    arrUserBookedSessions: [],
    serverCurrentTime:"",
    bookTime:"",
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getOrderTimeSessionRequest:
            return {
                ...state,
                isSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getOrderTimeSessionSuccess:
            return {
                ...state,
                arrUserBookedSessions: action.response.OrderTimeMeta,
                serverCurrentTime: action.response.serverCurrentTime,
                bookTime: action.response.bookTime,
                isSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getOrderTimeSessionFailure:
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
