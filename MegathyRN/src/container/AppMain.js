/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { connect } from 'react-redux';

import Router from '../Router/Router'
import LoginRouter from '../Router/LoginRouter'

export default class AppMain extends Component {
  render() {
    // if (this.props.isLoggedIn) {
      return (<Router/>) 
    // } else {
    //   return (<LoginRouter/>)
    // }
    ;
  }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
//       isLoggedIn: state.isLoggedIn
//   };
// }

// export default connect(mapStateToProps)(AppMain);
