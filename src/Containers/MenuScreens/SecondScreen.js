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
  TouchableOpacity
} from 'react-native';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../AppRedux/Actions/actions';

class SecondScreen extends Component {
  static  navigationOptions = ({ navigation }) => ( {
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('DrawerToggle')}>
		              <Image style={{marginLeft:16}} source={require('../../Resources/Images/menu.png')}/> 
                </TouchableOpacity>,
    headerStyle: {
      backgroundColor: 'yellow'
    }            
  })

  requestChild = () => {
    // this.props.getSecondScreenTap();
  }

  componentDidUpdate() {
      this.props.navigation.navigate('SecondScrElement');
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Second Screen!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        {/* <Button style={styles.btnStyle} title="Child Element" onPress={this.requestChild} /> */}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
	return {
    secondComp:state.dataReducer.secondComp,
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondScreen)

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
