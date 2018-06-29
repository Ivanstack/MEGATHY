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
  if (global.arrCartItems) {
    global.arrCartItems.map((cartItem, itemIdx) => {
      // constant.debugLog("Find Cart Item : ==> ", cartItem);
      if (cartItem.PkId === cartItemName) {
        findCartItem = cartItem;
      }
    });
  }

  return findCartItem;
}

export function getTotalPriceCartItems() {
  let totalPrice = 0.0;
  global.arrCartItems.map((cartItem, itemIdx) => {
    let finalProductPrice =
      cartItem.product_price[0].status === constant.kProductDiscountActive
        ? cartItem.product_price[0].discountPrice
        : cartItem.product_price[0].price;
    constant.debugLog("Find Cart Item : ==> ", cartItem.product_price);
    totalPrice = totalPrice + finalProductPrice * cartItem.totalAddedProduct;
  });

  return totalPrice;
}
