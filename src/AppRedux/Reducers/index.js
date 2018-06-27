// Redux
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import saga from "redux-saga";
import { watcherSaga } from "../Sagas/sagas";

const rootReducer = combineReducers({
    login: require("./LoginReducer").reducer
});

export let sagaMiddleware = saga();
let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watcherSaga);
export default store;
