// Redux
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import saga from "redux-saga";
import { watcherSaga } from "../Sagas/sagas";

const rootReducer = combineReducers({
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
    selectTime: require("./SelectTimeReducer").reducer,
    category: require("./CategoryReducer").reducer,
});

export let sagaMiddleware = saga();
let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watcherSaga);
export default store;
