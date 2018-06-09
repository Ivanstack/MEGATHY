
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import LoginScr from '../container/LoginScr'

// Main Navigation Flow
const Login = StackNavigator({
  LoginScr: { screen: LoginScr },
});

// Navigation Option
Login.navigationOptions = {
	header: null,
	gesturesEnabled: false
}

export default Login; 
