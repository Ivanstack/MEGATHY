/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";

import AppTextField from "../../../../Components/AppTextField";
import constant from "../../../../Helper/Constants";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../../../AppRedux/Actions/actions";

// Device Info
var DeviceInfo = require("react-native-device-info");

// Common Utilities
import * as CommonUtilities from "../../../../Helper/CommonUtilities";

// Network Utility
import * as networkUtility from "../../../../Helper/NetworkUtility";

// Loading View
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/EvilIcons";

// IQKeyboard Manager
import KeyboardManager from "react-native-keyboard-manager";

// Localization
import baseLocal from "../../../../Resources/Localization/baseLocalization";

class AddAddressScreen extends Component {
  constructor(props) {
    super(props);

    baseLocal.locale = global.currentAppLanguage;
    KeyboardManager.setShouldResignOnTouchOutside(true);
    KeyboardManager.setToolbarPreviousNextButtonEnable(false);

    this.onPressBack = this.onPressBack.bind(this);
    this.onPressSave = this.onPressSave.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.onSubmitFullName = this.onSubmitFullName.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);
    this.onSubmitAddress = this.onSubmitAddress.bind(this);
    this.onSubmitNotes = this.onSubmitNotes.bind(this);

    this.fullNameRef = this.updateRef.bind(this, "fullName");
    this.phoneRef = this.updateRef.bind(this, "phone");
    this.addressRef = this.updateRef.bind(this, "address");
    this.notesRef = this.updateRef.bind(this, "notes");

    this.state = {
      secureTextEntry: true,
      fullName: global.currentUser.userName,
      phone: global.currentUser.phone,
      address: "",
      notes: "",
      visible: false,
    };
  }

  // @observable visible = false;
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              // console.log("Nav Params :==> ",navigation.state.params);
              if (
                navigation.state.params != undefined &&
                navigation.state.params.category != undefined
              ) {
                navigation.goBack();
              } else {
                navigation.navigate("DrawerToggle");
              }
            }}
          >
            <Icon
              name={
                navigation.state.params != undefined &&
                navigation.state.params.category != undefined
                  ? "arrow-left"
                  : "navicon"
              }
              style={{ marginLeft: 10 }}
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}> Meghathy </Text>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#CF2526"
    }
  });

  componentDidMount() {
    let selectedAddressTemp = this.props.navigation.getParam(
      "selectedAddress",
      ""
    );
    if (selectedAddressTemp != "") {
      this.setState({
        fullName: selectedAddressTemp.name,
        phone: selectedAddressTemp.phone,
        address: selectedAddressTemp.address,
        notes: selectedAddressTemp.note
      });
    }
  }

  onPressSave() {
    return;
    if (this.state.fullName.trim() === "") {
      CommonUtilities.showAlert("Full Name cannot be blank");
      return;
    }

    if (this.state.phone === "") {
      CommonUtilities.showAlert("Please register phone number first");
      return;
    }

    if (this.state.address === "") {
      CommonUtilities.showAlert("Password cannot be blank");
      return;
    }

    // var registerParameters = {
    //     userName: this.state.fullName,
    //     email: this.state.email,
    //     phone: this.state.email,
    //     deviceType: Platform.OS === "ios" ? constant.deviceTypeiPhone : constant.deviceTypeAndroid,
    //     notifyId: constant.notifyId,
    //     timeZone: constant.timeZone,
    //     vendorId: DeviceInfo.getUniqueID(),
    //     appVersion: DeviceInfo.appVersion === undefined ? "0.0" : DeviceInfo.appVersion,
    // };

    // Show Loading View
    this.setState({ visible: true });

    networkUtility.postRequest(constant.APIRegister, registerParameters).then(
      result => {
        // Hide Loading View
        this.setState({ visible: false });
      },
      error => {
        // Hide Loading View
        this.setState({ visible: false });

        constant.debugLog("Status Code: " + error.status);
        constant.debugLog("Error Message: " + error.message);
        if (error.status != 500) {
          if (
            global.currentAppLanguage === constant.languageArabic &&
            error.data["messageAr"] != undefined
          ) {
            CommonUtilities.showAlert(error.data["messageAr"], false);
          } else {
              CommonUtilities.showAlert(error.data["message"], false);
          }
        } else {
          constant.debugLog("Internal Server Error: " + error.data);
          CommonUtilities.showAlert("Opps! something went wrong");
        }
      }
    );
  }

  onPressBack() {
    this.props.navigation.goBack();
  }

  onFocus() {
    let { errors = {} } = this.state;
    for (let name in errors) {
      let ref = this[name];
      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }
    this.setState({ errors });
  }

  onChangeText(text) {
    ["fullName", "phone", "address", "notes"]
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitFullName() {
    // this.phone.focus();
  }

  onSubmitPhone() {
    // this.password.focus();
  }

  onSubmitAddress() {
    // this.confirmPassword.focus();
  }

  onSubmitNotes() {
    // this.confirmPassword.blur();
    // this.onPressSignUp();
  }

  onAccessoryPress() {
    this.setState(({ secureTextEntry }) => ({
      secureTextEntry: !secureTextEntry
    }));
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    let {
      errors = {},
      secureTextEntry,
      fullName,
      email,
      password
    } = this.state;

    return (
      // Main View (Container)
      <View style={styles.container}>
        <Spinner
          visible={this.state.visible}
          cancelable={true}
          // textContent={"Please wait..."}
          textStyle={{ color: "#FFF" }}
        />
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={styles.scrollView}
        >
          <View style={{ width: "80%" }}>
            {/* // Full Name Text Field */}
            <AppTextField
              reference={this.fullNameRef}
              label={baseLocal.t("Full Name")}
              value={this.state.fullName}
              textColor={constant.themeColor}
              baseColor={constant.themeColor}
              tintColor={constant.themeColor}
              returnKeyType="next"
              onSubmitEditing={this.onSubmitFullName}
              onChangeText={this.onChangeText}
              onFocus={this.onFocus}
            />

            {/* // Phone No Text Field */}
            <AppTextField
              reference={this.phoneRef}
              label={baseLocal.t("Phone No")}
              value={this.state.phone}
              textColor={constant.themeColor}
              baseColor={constant.themeColor}
              tintColor={constant.themeColor}
              returnKeyType="next"
              keyboardType="numeric"
              onSubmitEditing={this.onSubmitPhone}
              onChangeText={this.onChangeText}
              onFocus={this.onFocus}
            />

            {/* // Password Text Field */}
            <AppTextField
              reference={this.addressRef}
              label={baseLocal.t("Press here to locate your address")}
              value={this.state.address}
              textColor={constant.themeColor}
              baseColor={constant.themeColor}
              tintColor={constant.themeColor}
              returnKeyType="next"
              onSubmitEditing={this.onSubmitAddress}
              onChangeText={this.onChangeText}
              onFocus={this.onFocus}
            />

            {/* // Confirm Password Text Field */}
            <AppTextField
              reference={this.notesRef}
              label={baseLocal.t("Location Notes")}
              value={this.state.notes}
              textColor={constant.themeColor}
              baseColor={constant.themeColor}
              tintColor={constant.themeColor}
              returnKeyType="done"
              onSubmitEditing={this.onSubmitNotes}
              onChangeText={this.onChangeText}
              onFocus={this.onFocus}
              multiline={true}
            />
          </View>

          {/* // Add Location Button */}
          <TouchableOpacity
            style={styles.loginButtonStyle}
            onPress={() => {
              alert("Add Location");
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Ebrima",
                fontWeight: "bold"
              }}
            >
              {baseLocal.t("Add Location")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    login: state.dataReducer.login
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAddressScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2"
  },
  loginButtonStyle: {
    width: "82%",
    marginTop: 20,
    backgroundColor: constant.themeColor,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  signUpButtonStyle: {
    width: "45%",
    marginTop: 20,
    backgroundColor: "#99050D",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: Dimensions.get("window").height
  },
  headerText: {
    color: "white",
    margin: 4,
    // marginLeft: 5,
    fontSize: 15,
    fontFamily: constant.themeFont
  }
});
