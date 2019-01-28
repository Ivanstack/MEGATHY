import React, { Component } from "react";
import {
    Platform,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AppState,
    SafeAreaView,
    FlatList,
    RefreshControl,
} from "react-native";
import { SearchBar } from 'react-native-elements'

// Redux
import { connect } from "react-redux";

// Common file
import * as constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Components Style
import SearchStyles from "../SearchScreen/SearchScrStyle";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import Swiper from "react-native-swiper";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility

import * as CommonUtilites from "../../../../Helper/CommonUtilities";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

// const AppSocket = new SocketIO('http://192.168.0.7:1339');

let contex = null

class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
    
        };
        baseLocal.locale = global.currentAppLanguage;
        contex = this
    }

    static navigationOptions = ({ navigation, state }) => ({

        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Nav Params :==> ", navigation);
                            if (
                                navigation.state.params != undefined
                            ) {
                                navigation.goBack();
                            }
                        }}
                    >
                        <Icon
                            name="arrow-left"
                            style={{ margin: 10 }}
                            size={30}
                            color="white"
                        />
                    </TouchableOpacity>
                    <SearchBar
                        ref='searchBar'
                        containerStyle={{ height: 0, width: 0 }}
                        inputStyle={{ backgroundColor: 'white', width: 300, height: 35, borderRadius: 8, alignItems: 'center', color: 'black', margin: 5, }}
                        round
                        searchIcon={{ width: 20, height: 20 }}
                        backgroundColor='white'
                        onChangeText={navigation.getParam('handleSearchItem')}
                    />
                </View>

            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
            height: 65
        },
    });

    componentWillMount() 
    {
        this.props.navigation.setParams({ handleSearchItem: this.handleSearchItem});
    }

    componentWillReceiveProps(newProps) {
       
    }



    render() {
        console.log(this.props.searchedData);
        return (
            <View style={SearchStyles.container}>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={require("../../../../Resources/Images/HomeScr/SearchImage.png")}/>
                <Text style={{ marginTop: 20, fontSize: 16 }}>Search All Products</Text>
                {this.props.searchedData.length > 0  ? (<FlatList 
                                            data = {this.props.searchedData}
                                            renderItem = {this.renderItem}/>) : (null)}
                
            </View>
        );
    }

    renderItem =  ({item}) => {
        <TouchableOpacity><Text>{item}</Text></TouchableOpacity>
    }


    handleSearchItem = (text) => {
        console.log(text);
        
        this.props.getSuggestion(text)
    }

}

// Store State in store
function mapStateToProps(state, props) {
 return {
    searchedData: state.serchProduct.searchedData
};
console.log(this.props.searchedData);

}

function mapDispatchToProps(dispatch) {
    return {
        getSuggestion: parameters =>
            dispatch({
                type: constant.actions.seachAllProductsRequest,
                payload: { endPoint: constant.APIGetproductSuggestion, parameters: parameters }
            })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchScreen);

