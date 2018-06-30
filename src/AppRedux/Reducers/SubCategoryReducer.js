import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshing: false,
    isSubCategoriesSuccess: false,
    arrSubCategories: [],
    subCategoryCurrentPage: 1,
    subCategoryLastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getSubCategoryRequest:
            return {
                ...state,
                isSubCategoriesSuccess: false,
                isRefreshing: true,
                isLoading: true,
                error: null,
            };
        case constant.actions.getSubCategorySuccess:
            return {
                ...state,
                arrSubCategories: action.response.current_page === 1 ? action.response.data: [...state.arrSubCategories, ...action.response.data].filter(
                    (val, id, array) => array.indexOf(val) === id
                ),
                subCategoryCurrentPage: action.response.current_page,
                subCategoryLastPage: action.response.last_page,
                isSubCategoriesSuccess: true,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getSubCategoryFailure:
            return {
                ...state,
                isSubCategoriesSuccess: false,
                isRefreshing: false,
                isLoading: false,
                error: action.error,
            };
        
        default:
            return state;
    }
};
