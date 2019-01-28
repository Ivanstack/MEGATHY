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
} from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import * as constant from "../../../../Helper/Constants";
import * as cartFunc from "../../../../Helper/Functions/Cart";

// Components Style
import CategoryStyles from "../CategoryScreen/CategoryStyles";

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


class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    baseLocal.locale = global.currentAppLanguage;
    }
    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", width: "100%"}}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Nav Params :==> ",navigation);
                            if (navigation.state.params != undefined) {
                                navigation.goBack();
                            } 
                        }}
                    >
                        <Icon
                            name= "arrow-left"
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={CategoryStyles.headerText}>{baseLocal.t("Megathy")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });


    render()
    {
        return (
            <View><Text>Hello</Text></View>
        );
    }
    
}

export default (SearchScreen)