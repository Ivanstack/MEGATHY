import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isRefreshingAll: false,
    isRefreshingPaid: false,
    isRefreshingReceived: false,
    isWalletSuccess: false,
    arrWalletAllData: [],
    arrWalletRedeemedData: [],
    arrWalletCollectedData: [],
    currentSelectedType: constant.kWalletTypeAll,
    currentPage: 1,
    lastPage: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getWalletHistoryRequest:
            return {
                ...state,
                isOrderHistorySuccess: false,
                isRefreshing: true,
                isLoading: true,
                error: null,
            };

        case constant.actions.getWalletHistorySuccess:
            return {
                ...state,
                arrWalletAllData:
                    action.response.currentType === constant.kWalletTypeAll
                        ? action.response.data.current_page === 1
                            ? action.response.data.data
                            : [...state.arrWalletAllData, ...action.response.data.data]
                        : [...state.arrWalletAllData],
                arrWalletRedeemedData:
                    action.response.currentType === constant.kWalletTypeRedeemed
                        ? action.response.data.current_page === 1
                            ? action.response.data.data
                            : [...state.arrWalletRedeemedData, ...action.response.data.data]
                        : [...state.arrWalletRedeemedData],
                arrWalletCollectedData:
                    action.response.currentType === constant.kWalletTypeCollected
                        ? action.response.data.current_page === 1
                            ? action.response.data.data
                            : [...state.arrWalletCollectedData, ...action.response.data.data]
                        : [...state.arrWalletCollectedData],
                currentSelectedType: action.response.currentType, // get current selected type
                currentPage: action.response.data.current_page,
                lastPage: action.response.data.last_page,
                isOrderHistorySuccess: true,
                isRefreshing: false,
                isLoading: false,
                error: null,
            };
        case constant.actions.getWalletHistoryFailure:
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
