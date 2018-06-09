//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Actions
export const TAP_LOGIN = 'TAP_LOGIN';
export const TAP_FIRST = 'TAP_FIRST';
export const TAP_SECOND = 'TAP_SECOND';
export const TAP_LOGOUT = 'TAP_LOGOUT';
export const DATA_AVAILABLE = 'DATA_AVAILABLE';

export function callLogin() {
    return (dispatch) => {
        dispatch({
            type: TAP_LOGIN,
            login: 'true'
        });
    };
}

export function getFirstScreenTap() {
    return (dispatch) => {
        dispatch({
            type: TAP_FIRST,
            firstComp: Math.random(),
        });
    };
}

export function getSecondScreenTap() {
    return (dispatch) => {
        dispatch({
            type: TAP_SECOND,
            secondComp: Math.random(),
        });

    };
}

// export function getData() {
//     return (dispatch) => {
//         setTimeout(() => {
//             var data = Data.instructions;
//             dispatch({
//                 type: DATA_AVAILABLE,
//                 data: data
//             });
//         }, 2000);

//     };
// }
