import { AsyncStorage } from 'react-native'
import constant from './Constants'

export function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function setInitialGlobalValues(){
    
    AsyncStorage.getItem(constant.keyCurrentUser).then((val) => {
        if(val === undefined){
            global.currentUser = null
        }else{
            global.currentUser = JSON.parse(val)
        }
        constant.debugLog("Current User: " + val)
    })
    
    AsyncStorage.getItem(constant.keyCurrentSettings).then((val) => {
        if(val === undefined){
            global.currentSettings = null
        }else{
            global.currentSettings = JSON.parse(val)
        }
        constant.debugLog("Current Settings: " + val)
    })

    AsyncStorage.getItem(constant.keyCurrentStore).then((val) => {
        if(val === undefined){
            global.currentStore = null
        }else{
            global.currentStore = JSON.parse(val)
            constant.debugLog("Current Store: " + val)
        }
    })
    
    AsyncStorage.getItem(constant.keyCurrentAppLanguage).then((val) => {
        if(val === undefined || val === null){
            global.currentAppLanguage = constant.languageEnglish
        }else{
            global.currentAppLanguage = val
        }
        constant.debugLog("Current App Language: " + global.currentAppLanguage)
    })
}
