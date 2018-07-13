import React from "react";
import { AsyncStorage, Alert, Dimensions } from "react-native";
import * as constant from "./Constants";
import baseLocal from "../Resources/Localization/baseLocalization"; // For Localization
import NavigationView from "../Components/NavigationView";

export function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function setInitialGlobalValues() {
    // global.arrCartItems = [];
    global.selectedTimeSlot = null;
    global.selectedAddress = null;
    AsyncStorage.getItem(constant.keyCurrentUser).then(val => {
        if (val === undefined) {
            global.currentUser = null;
        } else {
            global.currentUser = JSON.parse(val);
        }
        constant.debugLog("Current User: " + val);
    });

    AsyncStorage.getItem(constant.keyCurrentSettings).then(val => {
        if (val === undefined) {
            global.currentSettings = null;
        } else {
            global.currentSettings = JSON.parse(val);
        }
        constant.debugLog("Current Settings: " + val);
    });

    AsyncStorage.getItem(constant.keyCurrentStore).then(val => {
        if (val === undefined) {
            global.currentStore = null;
        } else {
            global.currentStore = JSON.parse(val);
            constant.debugLog("Current Store: " + val);
        }
    });

    // global.currentAppLanguage = constant.languageEnglish;
    // global.currentAppLanguage = constant.languageArabic;

    AsyncStorage.getItem(constant.keyCurrentAppLanguage).then(val => {
        if (val === undefined || val === null) {
            global.currentAppLanguage = constant.languageEnglish;
        } else {
            global.currentAppLanguage = val;
        }
        constant.debugLog("Current App Language: " + global.currentAppLanguage);
    });

    AsyncStorage.getItem(constant.keyCurrentCartItems).then(val => {
        if (val === undefined || val === null) {
            global.arrCartItems = [];
        } else {
            global.arrCartItems = JSON.parse(val);
            constant.debugLog("Current Cart Items: " + val);
        }
    });
}

export function showAlert(message, isLocalized = true, title = constant.alertTitle, buttonTitle = "OK") {
    setTimeout(() => {
        baseLocal.locale = global.currentAppLanguage;
        if (isLocalized) {
            Alert.alert(baseLocal.t(title), baseLocal.t(message), [{ text: baseLocal.t(buttonTitle) }]);
        } else {
            Alert.alert(baseLocal.t(title), message, [{ text: buttonTitle }]);
        }
    }, 200);
}

export function showNetworkAlert() {
    setTimeout(() => {
        baseLocal.locale = global.currentAppLanguage;
        Alert.alert(baseLocal.t(constant.alertTitle), baseLocal.t("Please check internet/wifi connection"), [
            { text: baseLocal.t("OK") },
        ]);
    }, 200);
}

export function showAlertYesNo(
    message,
    isLocalized = true,
    title = constant.alertTitle,
    buttonTitleYes = "Yes",
    buttonTitleNo = "No"
) {
    baseLocal.locale = global.currentAppLanguage;
    return new Promise((resolve, reject) => {
        if (isLocalized) {
            Alert.alert(baseLocal.t(title), baseLocal.t(message), [
                {
                    text: baseLocal.t(buttonTitleYes),
                    onPress: () => resolve(""),
                    style: "default",
                },
                {
                    text: baseLocal.t(buttonTitleNo),
                    onPress: () => reject(""),
                    style: "cancel",
                },
            ]);
        } else {
            Alert.alert(baseLocal.t(title), message, [
                { text: buttonTitleYes, onPress: () => resolve(""), style: "default" },
                { text: buttonTitleNo, onPress: () => reject(""), style: "cancel" },
            ]);
        }
    });
}

export function logout(isNormalLogout = true) {
    if (!isNormalLogout) {
        showAlert("You are already logged into another device. Please login again", false);
    }
    AsyncStorage.removeItem(constant.keyCurrentUser);
    AsyncStorage.removeItem(constant.keyCurrentSettings);
    AsyncStorage.removeItem(constant.keyCurrentStore);
    AsyncStorage.removeItem(constant.keyCurrentAppLanguage);
    AsyncStorage.removeItem(constant.keyCurrentCartItems);
    constant.emitter.emit(constant.logoutListener);
}

export function navigationView(title, isGoBack = false, rightButton = null) {
    return ({ navigation }) => ({
        headerLeft: (
            <NavigationView navigation={navigation} title={title} isGoBack={isGoBack} rightButton={rightButton} />
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });
}

export function dateAddingDays(days, oldDate = new Date()) {
    var newMilliSeconds = oldDate.getTime() + days * 86400000;
    // 86400000 ms in a day
    return new Date(newMilliSeconds);
}

export function dateAddingHours(hours, oldDate = new Date()) {
    var newMilliSeconds = oldDate.getTime() + hours * 3600000;
    // 3600000 ms in an hour
    return new Date(newMilliSeconds);
}

export function dateInDDMMYYYYFormat(oldDateString) {
    var today = new Date(oldDateString);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = "0" + dd;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    return dd + "/" + mm + "/" + yyyy;
}

export function safeImageURL(imgURL) {
    if (imgURL === (null || undefined || "")) {
        return require("../Resources/Images/DefaultProductImage.png");
    } else {
        return { uri: imgURL };
    }
}

// Way to implement showAlertYesNo function

// CommonUtilities.showAlertYesNo("Are you sure you want to delete this address?").then(
//     pressedYes => {
//         // User pressed Yes
//         constant.debugLog("User pressed Yes");
//     },
//     pressedNo => {
//         // User pressed No
//         constant.debugLog("User pressed No");
//     }
// );
