/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AppState,
    SafeAreaView,
    FlatList,
    RefreshControl,
    AsyncStorage,
    Dimensions,
} from "react-native";

// Redux
import { connect } from "react-redux";

// Common file




// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility

// Components Style

// Localization


// Class Variable

class FavouriteScreen extends Component {
    constructor(props) {
        super(props);
        // Class Props
        (this.currentPage = 1),
            (this.lastPage = 0),
            //Class State
            (this.state = {
                productQuentity: 0,
                cartItems: 0,
                isReload: true,
                visible: false,
                isRefreshing: false,
            });
    }

    static navigationOptions = ({ navigation }) => ({
        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log(navigation);
                            
                            navigation.state.params.onNavigateBack();
                            navigation.goBack();
                        }}
                    >
                        <Icon name="arrow-left" style={{ marginLeft: 10 }} size={35} color="white" />
                    </TouchableOpacity>
                    <Text >
                       
                    </Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    // App Life Cycle Methods

    async componentDidMount() {
       
    }

    componentWillUnmount() {
        
    }

    componentWillUpdate() {
       
    }

    componentWillReceiveProps(newProps) {
        
    }

    render()
    {
        return (
            <View style = {{flex:1, backgroundColor:'white'}}></View>
        )
    }
}
export default(FavouriteScreen)