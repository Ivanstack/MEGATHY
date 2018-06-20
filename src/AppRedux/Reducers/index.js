

import React, { Component } from 'react';
import {  View, Text, StyleSheet } from 'react-native';

// Redux
import { applyMiddleware, combineReducers, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import rootReducer from '../Reducers/reducers';

// Navigation
import Router from '../../Router/Router'

export default createStore(rootReducer, applyMiddleware(thunk));
