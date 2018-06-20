

//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Redux
import { combineReducers } from 'redux';

// Actions
export const TAP_LOGIN = 'TAP_LOGIN';
export const TAP_FIRST = 'TAP_FIRST';
export const TAP_SECOND = 'TAP_SECOND';
export const TAP_LOGOUT = 'TAP_LOGOUT';

let dataState = {
    data: [],
    firstComp: 'firstComp',
    secondComp: 'secondComp',
    login: 'false'
}

const dataReducer = (state = dataState, action) => {
  switch (action.type) {

    case TAP_LOGIN:
        console.log("Tap on Login Screen: " + action.login);
        state = Object.assign({}, state, {
            login: action.login,
        });
        return state;

    case TAP_FIRST:
        console.log("Tap on First Child Element Screen");
        state = Object.assign({}, state, {
            firstComp: action.firstComp,
        });
        return state;

    case TAP_SECOND:
        console.log("Tap on Second Child Element Screen");
        state = Object.assign({}, state, {
            secondComp: action.secondComp,
        });
        return state;

    case TAP_LOGOUT:
    console.log("Tap on Logout");
    return { ...state };

    default:
        return state
  }
};

const rootReducer = combineReducers({
    dataReducer
})

export default rootReducer;
