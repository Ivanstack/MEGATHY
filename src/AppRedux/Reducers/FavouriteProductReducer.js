import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshing: false,
    isProductSuccess: false,
    isDeleteSuccess: false,
    arrProduct: [],
    currentPage: 1,
    lastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getFavouriteProductRequest:
            return {
                ...state,
                isProductSuccess: false,
                isRefreshing: true,
                isLoading: action.payload.parameters.page > 1 ? false : true,
                error: null,
            };
        case constant.actions.getFavouriteProductSuccess:
            return {
                ...state,
                arrProduct:
                    action.response.current_page === 1
                        ? action.response.data
                        : [...state.arrProduct, ...action.response.data].filter(
                              (val, id, array) => array.indexOf(val) === id
                          ),
                currentPage: action.response.current_page,
                lastPage: action.response.last_page,
                isProductSuccess: true,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getFavouriteProductFailure:
            return {
                ...state,
                isProductSuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: action.error,
            };

            case constant.actions.removeFavouriteProductRequest:
            return {
                ...state,
                isDeleteSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.removeFavouriteProductSuccess:
            return {
                ...state,
                isDeleteSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.removeFavouriteProductFailure:
            return {
                ...state,
                isDeleteSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};