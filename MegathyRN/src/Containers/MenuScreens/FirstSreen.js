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
  View,
  Button,
  BackHandler,
  Image,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  AppState,
  SafeAreaView
} from 'react-native';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../AppRedux/Actions/actions';

// const AppSocket = new SocketIO('http://192.168.0.7:1339');

class FirstScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerLeft:   <TouchableOpacity onPress={() => navigation.navigate('DrawerToggle')}>
		                <Image style={{marginLeft:16}} source={require('../../Resources/Images/menu.png')}/> 
                  </TouchableOpacity>,
    headerStyle: {
      backgroundColor: 'yellow'
    }
  })

  requestChild = () => {
    this.props.getFirstScreenTap();
  }

  // App Life Cycle Methods

  componentDidMount() {
    console.log('App State: ', AppState.currentState);
  };
  
  componentWillUnmount() {
    console.log('App State: ', AppState.currentState);
  }

  componentDidUpdate() {
    // console.log('props data :', this.props.firstComp);
    // this.props.navigation.navigate('FirstScrElement');
  }

  // Mics Methods

  onPressActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Cancel', 'Destructive Action','Normal Action'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) { 
          console.log('Cancel Press');
        } else if (buttonIndex === 1) { /* destructive action */
          console.log('Destructive Action Press');
        } else if (buttonIndex === 2) { /* destructive action */
          console.log('Normal Action Press');
        }
      });
    } else {
      Alert:alert('This component not support in your OS')
    }
  }

  connectSocket = () => {
    // AppSocket.connect()
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to First Screen!
        </Text>
        <Button style={styles.btnStyle} title="Child Element" onPress={this.requestChild} />
        <Button style={styles.btnStyle} title="Action Sheet" onPress={this.onPressActionSheet} />        
        <Button style={styles.btnStyle} title="Connect Socket" onPress={this.connectSocket} />        
      </SafeAreaView>
    );
  }
}




// Store State in store
function mapStateToProps(state, props) {
  return {
    firstComp: state.dataReducer.firstComp,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btnStyle: {
    textAlign: 'center',
    color: '#333333',
    // fontSize: 17,
    margin: 5,
  },
});
