import { StyleSheet, Dimensions } from "react-native";

import * as constant from "../../Helper/Constants";

export function getCartItemsCount() {
  let itemsCount = 0;
  if (global.arrCartItems) {
    global.arrCartItems.map(cartItem => {
      itemsCount = itemsCount + cartItem.totalAddedProduct;
    });
  }

  return itemsCount;
}

export function findCartItem(cartItemName) {
  // global.arrCartItems.find((cartItem) => {
  //     constant.debugLog("Find Cart Item : ==> ",cartItem)
  //     return cartItem.name === cartItemName
  //   })
  let findCartItem = null;
  global.arrCartItems.map((cartItem, itemIdx) => {
    constant.debugLog("Find Cart Item : ==> ", cartItem);
    if (cartItem.name === cartItemName) {
      findCartItem = cartItem;
    }
  });

  return findCartItem;
}
