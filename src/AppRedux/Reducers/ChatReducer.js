import * as constant from "../../Helper/Constants";

// reducer with initial state
export const initialState = {
    isLoading: false,
    isGetChatSuccess: false,
    isSendMsgSuccess: false,
    arrChat: [],
    error: null,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.actions.getChatRequest:
            return {
                ...state,
                isGetChatSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.getChatSuccess:
            return {
                ...state,
                arrChat: action.response.data,
                isGetChatSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.getChatFailure:
            return {
                ...state,
                isGetChatSuccess: false,
                isLoading: false,
                error: action.error,
            };

        // Send Messages
        case constant.actions.sendMessageRequest:
            return {
                ...state,
                isSendMsgSuccess: false,
                isLoading: true,
                error: null,
            };
        case constant.actions.sendMessageSuccess:
            return {
                ...state,
                arrChat: [...state.arrChat, ...action.response],
                isSendMsgSuccess: true,
                isLoading: false,
                error: null,
            };
        case constant.actions.sendMessageFailure:
            return {
                ...state,
                isSendMsgSuccess: false,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
