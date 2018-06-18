import { StyleSheet, Dimensions } from "react-native";

import * as constant from '../../Helper/Constants'

export function getCartItemsCount() {
    let itemsCount = 0
    global.arrCartItems.map((cartItem)=>{
        itemsCount = itemsCount + cartItem.totalAddedProduct
    })
    return itemsCount
}