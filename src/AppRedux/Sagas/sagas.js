import { takeLatest, takeEvery, call, put } from "redux-saga/effects";
import { LoginScreenCalls } from "./LoginSagas";

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga(action) {
    yield takeEvery("LOGIN_CALL_REQUEST", LoginScreenCalls);
    yield takeEvery("FB_LOGIN_CALL_REQUEST", LoginScreenCalls);
}
