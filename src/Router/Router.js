import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, AsyncStorage } from "react-native";

// Navigation
import { DrawerNavigator, DrawerItems, StackNavigator } from "react-navigation";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Screens
import LoginScreen from "../Containers/LoginScreens/LoginScreen";
import SideMenuScreen from "../Containers/MenuScreens/SideMenu/SideMenuScreen";

// CategoryScreenNav
import CategoryScreen from "../Containers/MenuScreens/Category/CategoryScreen/CategoryScreen";
import SubCategoryScreen from "../Containers/MenuScreens/Category/SubCategoryScreen/SubCategoryScreen";
import ProductScreen from "../Containers/MenuScreens/Category/ProductScreen/ProductScreen";
import CartScreen from "../Containers/MenuScreens/Category/CartScreen/CartScreen";
import CalendarScreen from "../Containers/MenuScreens/OrderMaster/Calendar/CalendarScreen";
import SelectTimeScreen from "../Containers/MenuScreens/OrderMaster/SelectTime/SelectTimeScreen";
import OrderSummaryScreen from "../Containers/MenuScreens/OrderMaster/OrderSummaryScreen/OrderSummaryScreen";

// DeliveryDetailsNav
import AddressListScreen from "../Containers/MenuScreens/DeliveryDetails/AddressList/AddressListScreen";
import AddAddressScreen from "../Containers/MenuScreens/DeliveryDetails/AddAddress/AddAddressScreen";
import VerifyPhoneScreen from "../Containers/MenuScreens/DeliveryDetails/VerifyPhone/VerifyPhoneScreen";
import AddressMapScreen from "../Containers/MenuScreens/DeliveryDetails/AddressMap/AddressMapScreen";

// OrderHistoryScreenNav
import OrderHistoryScreen from "../Containers/MenuScreens/OrderHistory/OrderHistory/OrderHistoryScreen";
import OrderDetailScreen from "../Containers/MenuScreens/OrderHistory/OrderDetail/OrderDetailScreen";

// ScheduleOrderHistoryScreenNav
import ScheduleOrderListScreen from "../Containers/MenuScreens/ScheduleOrderHistory/ScheduleOrderList/ScheduleOrderListScreen";

// OrderStatusScreenNav

// UserProfileScreenNav
import UserProfileScreen from "../Containers/MenuScreens/UserProfile/UserProfile/UserProfileScreen";
import EditUserProfileScreen from "../Containers/MenuScreens/UserProfile/EditUserProfile/EditUserProfileScreen";
import ChangePasswordScreen from "../Containers/MenuScreens/UserProfile/ChangePassword/ChangePasswordScreen";

// MyRewardsWalletScreenNav

// StoreScreenNav
import StoreScreen from "../Containers/PostLoginScreens/StoreScreen";

// SuggestProductScreenNav
import SuggestProductScreen from "../Containers/MenuScreens/SuggestProduct/SuggestProductScreen";

// TermsOfServicesScreenNav
import TermsOfServicesScreen from "../Containers/MenuScreens/TermsOfServices/TermsOfServicesScreen";

// ContactUsScreenNav
import ContactUsScreen from "../Containers/MenuScreens/ContactUs/ContactUsScreen";

// ChatScreenNav
import ChatScreen from "../Containers/MenuScreens/ChatScreen/ChatScreen";

import OrderMasterScreen from "../Containers/MenuScreens/OrderMaster/OrderMasterScreen";
import SecondScreen from "../Containers/MenuScreens/SecondScreen";

// Constant
import * as constant from "../Helper/Constants";
import * as commonUtilities from "../Helper/CommonUtilities";

// Modal Screen
// const OrderMasterScreenNav = StackNavigator(
//     {
//         OrderMasterScreen: { screen: OrderMasterScreen },
//     },
//     {
//         headerMode: "none",
//         mode: "modal",
//     }
// );

// Home Screen With Child Element
const CategoryScreenNav = StackNavigator(
    {
        CategoryScreen: { screen: CategoryScreen },
        SubCategoryScreen: { screen: SubCategoryScreen },
        ProductScreen: { screen: ProductScreen },
        CartScreen: { screen: CartScreen },
        SelectTimeScreen: { screen: SelectTimeScreen },
        SelectTimeScreen: { screen: SelectTimeScreen },
        OrderSummaryScreen: { screen: OrderSummaryScreen },
        // OrderMasterScreen: { screen: OrderMasterScreen },
    },
    {
        headerMode: "screen",
    }
);

// Delivery Detail Screen With Child Element
const DeliveryDetailsNav = StackNavigator(
    {
        AddressMapScreen: { screen: AddressMapScreen },
        AddressListScreen: { screen: AddressListScreen },
        AddAddressScreen: { screen: AddAddressScreen },
        VerifyPhoneScreen: { screen: VerifyPhoneScreen },
    },
    {
        headerMode: "screen",
    }
);

// Order History Screen With Child Element
const OrderHistoryScreenNav = StackNavigator(
    {
        OrderHistoryScreen: { screen: OrderHistoryScreen },
        OrderDetailScreen: { screen: OrderDetailScreen },
    },
    {
        headerMode: "screen",
    }
);

// Schedule Order History Screen With Child Element
const ScheduleOrderHistoryScreenNav = StackNavigator(
    {
        ScheduleOrderListScreen: { screen: ScheduleOrderListScreen },
    },
    {
        headerMode: "screen",
    }
);

// Schedule Order History Screen With Child Element
const OrderStatusScreenNav = StackNavigator(
    {
        OrderHistoryScreen: { screen: OrderHistoryScreen },
        OrderDetailScreen: { screen: OrderDetailScreen },
    },
    {
        headerMode: "screen",
    }
);

// User Profile Screen With Child Element
const UserProfileScreenNav = StackNavigator(
    {
        "User Profile": { screen: UserProfileScreen },
        EditUserProfileScreen: { screen: EditUserProfileScreen },
        ChangePasswordScreen: { screen: ChangePasswordScreen },
    },
    {
        headerMode: "screen",
    }
);

// My Rewards Wallet Screen With Child Element
const MyRewardsWalletScreenNav = StackNavigator(
    {
        OrderHistoryScreen: { screen: OrderHistoryScreen },
        OrderDetailScreen: { screen: OrderDetailScreen },
    },
    {
        headerMode: "screen",
    }
);

// Suggest Product Screen With Child Element
const StoreScreenNav = StackNavigator(
    {
        StoreScreen: { screen: StoreScreen },
    },
    {
        headerMode: "screen",
    }
);

// Suggest Product Screen With Child Element
const SuggestProductScreenNav = StackNavigator(
    {
        SuggestProductScreen: { screen: SuggestProductScreen },
    },
    {
        headerMode: "none",
    }
);

// Terms Of Services Screen With Child Element
const TermsOfServicesScreenNav = StackNavigator(
    {
        TermsOfServicesScreen: { screen: TermsOfServicesScreen },
    },
    {
        headerMode: "screen",
    }
);

// Contact Us Screen With Child Element
const ContactUsScreenNav = StackNavigator(
    {
        ContactUsScreen: { screen: ContactUsScreen },
        OrderDetailScreen: { screen: OrderDetailScreen },
    },
    {
        headerMode: "screen",
    }
);

// Chat With Us Screen
const ChatScreenNav = StackNavigator(
    {
        ChatScreen: { screen: ChatScreen },
    },
    {
        headerMode: "screen",
    }
);

// Second Screen With Child Element
const TempScreenNav = StackNavigator(
    {
        "Temp Screen": { screen: SuggestProductScreen },
    },
    {
        headerMode: "screen",
    }
);

// Side Menu With Menu Items
const AppDrawer = DrawerNavigator(
    {
        Categories: { screen: CategoryScreenNav },
        "Delivery Details": { screen: DeliveryDetailsNav },
        "Order History": { screen: OrderHistoryScreenNav },
        "Schedule Orders": { screen: ScheduleOrderHistoryScreenNav },
        "Order Status": { screen: OrderHistoryScreenNav },
        "User Profile": { screen: UserProfileScreenNav },
        "My Rewards Wallet": { screen: OrderHistoryScreenNav },
        "Change Store": { screen: StoreScreenNav },
        "Suggest a Product": { screen: SuggestProductScreenNav },
        "Terms of Services": { screen: TermsOfServicesScreenNav },
        "Contact us": { screen: ContactUsScreenNav },
        "Chat with us": { screen: ChatScreenNav },
        // "Temp Screen": { screen: TempScreenNav },
    },
    {
        drawerWidth: 300,
        drawerBackgroundColor: "black",
        navigationOptions: {
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: "yellow",
            },
        },
        contentOptions: {
            activeBackgroundColor: "black",
            inactiveBackgroundColor: "black",
            inactiveTintColor: "green",
            activeTintColor: "yellow",
            itemsContainerStyle: {
                marginVertical: 0,
            },
            iconContainerStyle: {
                opacity: 1,
            },
        },
        headerMode: "none",
        contentComponent: props => <SideMenuScreen drawerProps={props} onPressLogout={this.onPressLogout} />,
    }
);

// Main Navigation Flow
const App = StackNavigator(
    {
        Home: { screen: AppDrawer },
    },
    {
        headerMode: "none",
        navigationOptions: {
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: constant.themeColor,
            },
        },
    }
);

// Mics Methods
export function onPressLogout() {
    console.log("Logout Pressed");
    commonUtilities.logout();
    // this.props.onPressLogout()
}

function tapSecondScreen() {
    // this.props.getSecondScreenTap()
}

function mapStateToProps(state, props) {
    return {
        // secondComp: state.dataReducer.secondComp,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

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
        height: 30,
        width: 30,
        resizeMode: "contain",
        // marginTop:20,
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 15,
    },
    menuTitle: {
        fontFamily: constant.themeFont,
        fontSize: 17,
        marginLeft: 16,
        color: "white",
    },
});
