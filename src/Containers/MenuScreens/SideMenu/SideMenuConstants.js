// Localization
import React from "react";
import { Image, Dimensions, StyleSheet } from "react-native";

// Constant
import * as constant from "../../../Helper/Constants";
import * as commonUtilities from "../../../Helper/CommonUtilities";

module.exports = {
    sideMenuItems: [
        {
            name: "Categories",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.category, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.category, true),
        },
        {
            name: "Delivery Details",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.deliveryDetails, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.deliveryDetails, true),
        },
        {
            name: "Order History",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.orderHistory, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.orderHistory, true),
        },
        {
            name: "Scheduled Orders",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.scheduledOrders, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.scheduledOrders, true),
        },
        {
            name: "Order Status",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.orderStatus, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.orderStatus, true),
        },
        {
            name: "Favourite",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.favourite, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.favourite, true),
        },
        {
            name: "User Profile",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.profile, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.profile, true),
        },
        {
            name: "My Rewards Wallet",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.wallet, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.wallet, true),
        },
        {
            name: "Change Store",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.changeStore, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.changeStore, true),
        },
        {
            name: "Suggest a Product",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.suggestProduct, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.suggestProduct, true),
        },
        {
            name: "Terms of Services",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.termsOfServices, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.termsOfServices, true),
        },
        {
            name: "Contact us",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.contact, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.contact, true),
        },
        {
            name: "Feedback",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.feedback, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.feedback, true),
        },
        {
            name: "Logout",
            icon: commonUtilities.menuImage(constant.menuItemsKeys.logout, false),
            iconActive: commonUtilities.menuImage(constant.menuItemsKeys.logout, true),
        },
    ],
};
