import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Image, AsyncStorage } from "react-native";
import { NavigationActions, DrawerItems } from "react-navigation";

// Constant
import * as constant from "../../../Helper/Constants";
import * as sideMenuConstant from "./SideMenuConstants";
import * as commonUtilities from "../../../Helper/CommonUtilities";

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";

export default class SideMenuScreen extends Component {

    constructor(props){
        super(props);
        
    }


    _onPressLogout = () => {
        console.log("Props : ",this.props);
        let userID = "";
        AsyncStorage.getItem(constant.keyCurrentUser).then(value => (userID = value.id));
        var logoutSessionParameter = {
            userId: userID,
        };
        this.props.onPressLogout(logoutSessionParameter);
    };

    render = () => {
        return (
            <ScrollView>
                <View style={styles.maincontainer}>
                    <View style={styles.headercontainer}>
                        <Text style={styles.headerTitle}>
                            {/* {global.currentUser === null ? "Welcome, Guest" : "Welcome, " + global.currentUser.userName} */}
                            {global.currentUser === null ? "Welcome, Guest" : "Welcome, User"}
                        </Text>
                    </View>

                    <View style={{ flex: 1, backgroundColor: "black" }}>
                        <DrawerItems
                            {...this.props.drawerProps}
                            onItemPress={({ route, focused }) => {
                                this.props.drawerProps.onItemPress({ route, focused });
                                if (route.key === "AddressListScreen") {
                                    // this.props.drawerProps.getFirstScreenTap()
                                } else if (route.key === "SecondScreen") {
                                    // this.props.drawerProps.getSecondScreenTap()
                                    // this.props.drawerProps.getSecondScreenTap()
                                }
                            }}
                            getLabel={scene => {
                                let menuItemDetails = sideMenuConstant.sideMenuItems[scene.index];
                                return (
                                    <View style={styles.rowView}>
                                        {scene.focused ? menuItemDetails.iconActive : menuItemDetails.icon}
                                        <Text
                                            style={[
                                                styles.menuTitle,
                                                { color: scene.focused ? constant.themeColor : "white" },
                                            ]}
                                        >
                                            {baseLocal.t(menuItemDetails.name)}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={this._onPressLogout}>
                        <View style={styles.rowView}>
                            <Image
                                style={styles.menuImage}
                                source={require("../../../Resources/Images/MenuIcons/logout.png")}
                            />
                            <Text style={styles.menuTitle}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
    },
    headercontainer: {
        flex: 1,
        height: 120,
        backgroundColor: "black",
    },
    userimage: {
        height: 60,
        width: 60,
        resizeMode: "contain",
        marginTop: 20,
        marginLeft: 20,
        borderWidth: 1,
        borderRadius: 30,
    },
    headerTitle: {
        fontFamily: constant.themeFont,
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginLeft: 20,
        marginTop: 60,
    },
    headerSubTitle: {
        fontSize: 15,
        color: "white",
        marginLeft: 20,
    },
    rowView: {
        flexDirection: "row",
        flex: 1,
        // justifyContent: 'center',
        alignItems: "center",
        padding: 10,
        // marginTop:10
    },
    menuImage: {
        resizeMode: "contain",
        marginLeft: 10,
    },
    menuTitle: {
        fontFamily: constant.themeFont,
        fontSize: 17,
        marginLeft: 16,
        color: "white",
    },
});
