import * as constant from "../../Helper/Constants";
import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import { LoginScreenCalls } from "./LoginSagas";
import { SignUpScreenCalls } from "./SignUpSagas";
import { ForgotPasswordScreenCalls } from "./ForgotPasswordSagas";
import { VerifyCodeScreenCalls } from "./VerifyCodeSagas";
import { ResetPasswordScreenCalls } from "./ResetPasswordSagas";
import { CityScreenCalls } from "./CitySagas";
import { AreaScreenCalls } from "./AreaSagas";
import { StoreScreenCalls } from "./StoreSagas";
import { SelectTimeScreenCalls } from "./SelectTimeSagas";
import { SelectTimeScheduleScreenCalls } from "./SelectTimeScheduleSagas";
import { CalendarScreenCalls } from "./CalendarSagas";
import { CategoryScreenCalls } from "./CategorySagas";
import { AddressListScreenCalls } from "./AddressListSagas";
import { AddAddressScreenCalls } from "./AddAddressSagas";
import { SubCategoryScreenCalls } from "./SubCategorySagas";
import { ProductScreenCalls } from "./ProductSagas";
import { GeneralAPICallSagas } from "./GeneralAPICallSagas";
import { OrderSummaryScreenCalls } from "./OrderSummarySagas";

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga(action) {

    // General API Call
    yield takeEvery(constant.actions.getAppSettingAndRewardPointRequest, GeneralAPICallSagas);
    yield takeEvery(constant.actions.getStoreTimezoneRequest, GeneralAPICallSagas);

    // Login/SignUp Flow
    // Login Screen
    yield takeEvery(constant.actions.loginRequest, LoginScreenCalls);
    yield takeEvery(constant.actions.FBLoginRequest, LoginScreenCalls);

    // SignUp Screen
    yield takeEvery(constant.actions.signUpRequest, SignUpScreenCalls);

    // Forgot Password Screen
    yield takeEvery(constant.actions.forgotPasswordRequest, ForgotPasswordScreenCalls);
    

    // Verify Code Screen
    yield takeEvery(constant.actions.verifyCodeRequest, VerifyCodeScreenCalls);
    yield takeEvery(constant.actions.verifyPhoneRequest, VerifyCodeScreenCalls);

    // Reset Password Screen
    yield takeEvery(constant.actions.resetPasswordRequest, ResetPasswordScreenCalls);

    // Post Login/SignUp Flow
    // City Screen
    yield takeEvery(constant.actions.getCityRequest, CityScreenCalls);

    // Area Screen
    yield takeEvery(constant.actions.getAreaRequest, AreaScreenCalls);

    // Store Screen
    yield takeEvery(constant.actions.getStoreRequest, StoreScreenCalls);
    yield takeEvery(constant.actions.setStoreRequest, StoreScreenCalls);

    // Menu Screens Flow
    // SelectTime Screen
    yield takeEvery(constant.actions.getOrderTimeSessionRequest, SelectTimeScreenCalls);
    yield takeEvery(constant.actions.getOrderTimeSessionChangeSuccessFlagRequest, SelectTimeScreenCalls);

    // SelectTimeSchedule Screen
    yield takeEvery(constant.actions.setOrderTimeSessionRequest, SelectTimeScheduleScreenCalls);
    yield takeEvery(constant.actions.setOrderTimeSessionChangeSuccessFlagRequest, SelectTimeScheduleScreenCalls);

    // Calendar Screen
    yield takeEvery(constant.actions.getUserBookedSessionRequest, CalendarScreenCalls);
    yield takeEvery(constant.actions.unsetOrderTimeSessionRequest, CalendarScreenCalls);

    // Category Screen
    yield takeEvery(constant.actions.getCategoryRequest, CategoryScreenCalls);
    yield takeEvery(constant.actions.getBannerRequest, CategoryScreenCalls);

    // SubCategory Screen
    yield takeEvery(constant.actions.getSubCategoryRequest, SubCategoryScreenCalls);
    
    // Product Screen
    yield takeEvery(constant.actions.getProductRequest, ProductScreenCalls);
    
    // Address List Screen
    yield takeEvery(constant.actions.getAddressRequest, AddressListScreenCalls);
    yield takeEvery(constant.actions.deleteAddressRequest, AddressListScreenCalls);
    
    // Add Address Screen
    yield takeEvery(constant.actions.addAddressRequest, AddAddressScreenCalls);
    yield takeEvery(constant.actions.editAddressRequest, AddAddressScreenCalls);
    
    // Order Summary Screen
    yield takeEvery(constant.actions.checkCoupenCodeRequest, OrderSummaryScreenCalls);
    yield takeEvery(constant.actions.setOrderRequest, OrderSummaryScreenCalls);
    yield takeEvery(constant.actions.setScheduleOrderRequest, OrderSummaryScreenCalls);
}
