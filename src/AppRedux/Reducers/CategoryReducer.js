import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshing: false,
    isCategoriesSuccess: false,
    isBannersSuccess: false,
    arrCategories: [],
    arrBanners: [],
    currentPage: 1,
    lastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getCategoryRequest:
            return {
                ...state,
                isCategoriesSuccess: false,
                isRefreshing: true,
                isLoading: true,
                error: null,
            };
        case constant.actions.getCategorySuccess:
            return {
                ...state,
                arrCategories: action.response.current_page === 1 ? action.response.data: [...state.arrCategories, ...action.response.data].filter(
                    (val, id, array) => array.indexOf(val) === id
                ),
                currentPage: action.response.current_page,
                lastPage: action.response.last_page,
                isCategoriesSuccess: true,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getCategoryFailure:
            return {
                ...state,
                isCategoriesSuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: action.error,
            };
        case constant.actions.getBannerRequest:
            return {
                ...state,
                isBannersSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getBannerSuccess:
            return {
                ...state,
                arrBanners: action.response,
                isBannersSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getBannerFailure:
            return {
                ...state,
                isBannersSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
