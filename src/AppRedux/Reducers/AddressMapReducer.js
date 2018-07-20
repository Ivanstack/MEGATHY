import * as constant from "../../Helper/Constants";
// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshing: false,
    isGetSuccess: false,
    isDeleteSuccess: false,
    arrAddress: [],
    currentPage: 1,
    lastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getAddressRequest:
            return {
                ...state,
                isGetSuccess: false,
                isDeleteSuccess: false,
                isRefreshing: true,
                isLoading: true,
                error: null,
            };
        case constant.actions.getAddressSuccess:
            return {
                ...state,
                arrAddress:
                    action.response.current_page === 1
                        ? action.response.data
                        : [...state.arrAddress, ...action.response.data].filter(
                              (val, id, array) => array.indexOf(val) === id
                          ),
                currentPage: action.response.current_page,
                lastPage: action.response.last_page,
                isGetSuccess: true,
                isDeleteSuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getAddressFailure:
            return {
                ...state,
                isGetSuccess: false,
                isDeleteSuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.deleteAddressRequest:
            return {
                ...state,
                isGetSuccess: false,
                isDeleteSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.deleteAddressSuccess:
            return {
                ...state,
                isGetSuccess: false,
                isDeleteSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.deleteAddressFailure:
            return {
                ...state,
                isGetSuccess: false,
                isDeleteSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
