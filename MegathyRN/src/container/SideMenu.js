
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View } from 'react-native';
// import styles from './SideMenu.style';
import { NavigationActions } from 'react-navigation';


export default class SideMenu extends Component {
    navigateToScreen = (route) => () => {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
    }
  
    render () {
      return (
        <View style={styles.container}>
          <ScrollView>
              
            <View>
              <Text style={styles.sectionHeadingStyle}>
                Section 1
              </Text>
              <View style={styles.navSectionStyle}>
                <Text style={styles.navItemStyle} onPress={this.navigateToScreen('FirstScreen')}>
                Page1
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.sectionHeadingStyle}>
                Section 2
              </Text>
              <View style={styles.navSectionStyle}>
                <Text style={styles.navItemStyle} onPress={this.navigateToScreen('SecondScreenNav')}>
                  Page2
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.footerContainer}>
            <Text>This is my fixed footer</Text>
          </View>
        </View>
      );
    }
  }
  
  SideMenu.propTypes = {
    navigation: PropTypes.object
  };

  const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1
      },
      navItemStyle: {
        padding: 10
      },
      navSectionStyle: {
        backgroundColor: 'lightgrey'
      },
      sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5
      },
      footerContainer: {
        padding: 20,
        backgroundColor: 'lightgrey'
      }
  }) 
  