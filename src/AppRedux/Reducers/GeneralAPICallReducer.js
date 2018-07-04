import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isSuccess: false,
    totalRewardPoint: 0,
    totalRewardPoint_SR: 0,
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getAppSettingAndRewardPointRequest:
            return {
                ...state,
                isSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getAppSettingAndRewardPointSuccess:
            return {
                ...state,
                totalRewardPoint: action.response.total_reward,
                totalRewardPoint_SR: action.response.total_reward_sr,
                isSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getAppSettingAndRewardPointFailure:
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
