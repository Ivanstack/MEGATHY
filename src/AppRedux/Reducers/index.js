// Redux
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import saga from "redux-saga";
import { watcherSaga } from "../Sagas/sagas";

const rootReducer = combineReducers({
    // General API Call
    general: require("./GeneralAPICallReducer").reducer,

    // Login/SignUp Flow
    login: require("./LoginReducer").reducer,
    signup: require("./SignUpReducer").reducer,
    forgotPassword: require("./ForgotPasswordReducer").reducer,
    verifyCode: require("./VerifyCodeReducer").reducer,
    resetPassword: require("./ResetPasswordReducer").reducer,

    // Post Login/SignUp Flow
    city: require("./CityReducer").reducer,
    area: require("./AreaReducer").reducer,
    store: require("./StoreReducer").reducer,

    //Menu Flow
    subcategory: require("./SubCategoryReducer").reducer,
    category: require("./CategoryReducer").reducer,
    selectTime: require("./SelectTimeReducer").reducer,
    selectTimeSchedule: require("./SelectTimeScheduleReducer").reducer,
    addressList: require("./AddressListReducer").reducer,
    addAddress: require("./AddAddressReducer").reducer,
    productList: require("./ProductReducer").reducer,
    orderSummary: require("./OrderSummaryReducer").reducer,
});

export let sagaMiddleware = saga();
let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watcherSaga);
export default store;
