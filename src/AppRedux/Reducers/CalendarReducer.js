import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isGetSuccess: false,
    isUnsetSuccess: false,
    arrUserBookedSessions: [],
    serverCurrentTime: "",
    bookTime: "",
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getUserBookedSessionRequest:
            return {
                ...state,
                isGetSuccess: false,
                isUnsetSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getUserBookedSessionSuccess:
            return {
                ...state,
                arrUserBookedSessions: action.response.OrderTimeMeta,
                serverCurrentTime: action.response.serverCurrentTime,
                bookTime: action.response.bookTime,
                isGetSuccess: true,
                isUnsetSuccess: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getUserBookedSessionFailure:
            return {
                ...state,
                isGetSuccess: false,
                isUnsetSuccess: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.unsetOrderTimeSessionRequest:
            return {
                ...state,
                isGetSuccess: false,
                isUnsetSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.unsetOrderTimeSessionSuccess:
            return {
                ...state,
                isGetSuccess: false,
                isUnsetSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.unsetOrderTimeSessionFailure:
            return {
                ...state,
                isGetSuccess: false,
                isUnsetSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
