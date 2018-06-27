// action types
const FB_LOGIN_CALL_REQUEST = "FB_LOGIN_CALL_REQUEST";
const LOGIN_CALL_REQUEST = "LOGIN_CALL_REQUEST";
const LOGIN_CALL_SUCCESS = "LOGIN_CALL_SUCCESS";
const LOGIN_CALL_FAILURE = "LOGIN_CALL_FAILURE";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isLogin: false,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_CALL_REQUEST:
            return { ...state, isLogin: false, isLoading: true };
        case FB_LOGIN_CALL_REQUEST:
            return { ...state, isLogin: false, isLoading: true };
        case LOGIN_CALL_SUCCESS:
            return { ...state, isLogin: true, isLoading: false };
        case LOGIN_CALL_FAILURE:
            return { ...state, isLogin: false, isLoading: false };
        default:
            return state;
    }
};
