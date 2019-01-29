/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, AsyncStorage, Dimensions } from "react-native";
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    Image,
    Modal,
    ActionSheetIOS,
    TouchableWithoutFeedback,
    CameraRoll,
    Alert,
} from "react-native";

import { connect } from "react-redux"; // Redux
import * as constant from "../../../Helper/Constants"; // Constants
import * as CommonUtilities from "../../../Helper/CommonUtilities"; // Common Utilities
import * as networkUtility from "../../../Helper/NetworkUtility"; // Network Utility
import Spinner from "react-native-loading-spinner-overlay"; // Loading View
import baseLocal from "../../../Resources/Localization/baseLocalization"; // Localization
import ImageLoad from "react-native-image-placeholder";
import ImagePicker from 'react-native-image-picker'; //Image Picker 
import moment from "moment"; // Date/Time Conversition

//Common Styles
import CommonStyle from "../../../Helper/CommonStyle"

//Lib
import Icon from "react-native-vector-icons/EvilIcons";

// Styles
import ChatScreenStyle from "./ChatScreenStyle";

class ChatScreen extends Component {
    constructor(props) {
        super(props);

        baseLocal.locale = global.currentAppLanguage;
        this.state = {
            arrChat: [],
            txtMsg: "",
            isShowImage: false,
        };

        senderId = global.currentUser.id;
        showImage = "";
    }

    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", width: "100%"}}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("Nav Params :==> ",navigation.state.params);
                            if (navigation.state.params != undefined && navigation.state.params.category != undefined) {
                                navigation.goBack();
                            } else {
                                navigation.navigate("DrawerToggle");
                            }
                        }}
                    >
                        <Icon
                            name={
                                navigation.state.params != undefined && navigation.state.params.category != undefined
                                    ? "arrow-left"
                                    : "navicon"
                            }
                            style={{ marginLeft: 10 }}
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={CommonStyle.headerText}>{baseLocal.t("Messages")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: constant.themeColor,
        },
    });
    componentDidMount() {
        this.props.getChat();
    }

    componentWillReceiveProps(newProps) {
        // if (newProps.isGetChatSuccess === true) {
        //     this.forceUpdate();
        //     // if (this.chatList != undefined) {
        //     //     this.chatList.scrollToIndex(true, newProps.arrChat.length - 1);
        //     // }
        // }
        if (newProps.isSendMsgSuccess === true) {
            this.setState({ txtMsg: "" }, () => {
                if (this.chatList != undefined) {
                    // setTimeout(() => {
                    //     this.chatList.scrollToEnd({animated:true});
                    //     //this.chatList.scrollToIndex({ animated: true, index: newProps.arrChat.length - 1 });
                    // }, 600);
                }
            });
        }else if(newProps.isGetChatSuccess === true) {
            this.forceUpdate();
            if (this.chatList != undefined) {
                this.chatList.scrollToEnd({animated:true});
            }
        }
    }

    componentDidUpdate() {
        if (this.chatList != undefined) {
            setTimeout(() => {
                this.chatList.scrollToEnd({animated:true});
                //this.chatList.scrollToIndex({ animated: true, index: newProps.arrChat.length - 1 });
            }, 600);
        }
    }

    // Mics Methods

    _getTimeDifference = oldDate => {
        let currentDate = moment();
        let msgDate = moment(oldDate);
        let dayDiff = Math.abs(new Date().getTime() - new Date(oldDate).getTime()) / (1000 * 3600 * 24);

        if (Math.floor(dayDiff) > 0) {
            return moment(oldDate).fromNow();
        } else {
            let hours = Math.floor(currentDate.diff(msgDate, "hours"));
            let minutes = Math.floor(currentDate.diff(msgDate, "minutes") - hours * 60);
            let seconds = Math.floor(currentDate.diff(msgDate, "seconds") - minutes * 60);

            if (hours > 0) {
                return `${hours} hours, ${minutes} minutes ago`;
            } else if (minutes > 0) {
                return `${minutes} minutes, ${seconds} seconds ago`;
            } else {
                return `${seconds === 0 ? 1 : seconds} seconds ago`;
            }
        }
    };

    // On Press Methods
    _onPressSendMsg = (isSender = true) => {

        if(this.state.txtMsg.trim().length === 0) {
            return
        } 

        constant.debugLog("on Send press .....");

        let messageData = new FormData();
        messageData.append("message", this.state.txtMsg);
        messageData.append("vendorId", constant.DeviceInfo.getUniqueID());
        this.forceUpdate();
        this.props.sendMessage(messageData);

        // let arrChatTemp = this.state.arrChat;
        // let objChat = {};
        // objChat["msg"] = this.state.txtMsg;
        // objChat["senderId"] = isSender ? senderId : Math.random();
        // objChat["timeStamp"] = new Date().getTime();
        // arrChatTemp.push(objChat);
        // this.setState({ arrChat: arrChatTemp });
    };

    

    _onPressCameraButton = () => {

        const options = {
            title: 'Select Avatar',
        };

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({
              options: ['Camera', 'Photos','Cancel'],
            },
            (buttonIndex) => {
              if (buttonIndex === 0) { 
                console.log('Camera Press');
                this._openImagePickerCamera();
              } else if (buttonIndex === 1) { /* destructive action */
                console.log('Photos Press');
                this._openImagePickerGallary();
              } else if (buttonIndex === 2) { /* destructive action */
                console.log('Cancel Press');
              }
            });
          } else {
            Alert:alert('This component not support in your OS')
          }
    }


    //Image Picker Open Methods

    _openImagePickerGallary = () => {
        ImagePicker.launchImageLibrary(null, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert(response.error)
            } else {
                constant.debugLog("ImagePicker_Response =====>",response);
                constant.debugLog("on Send Picked Image .....");

                let imageData = new FormData();
                let objImg = {
                    name:response.fileName,
                    uri:response.uri,
                    type:response.type,
                }
                imageData.append("image", objImg);
                imageData.append("vendorId", constant.DeviceInfo.getUniqueID());
                this.forceUpdate();
                this.props.sendMessage(imageData);


            }
        });
    }
    _openImagePickerCamera = () => {
        ImagePicker.launchCamera(null, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert("Device has no Camera.")
            } else {
                constant.debugLog("ImagePicker_Response =====>",response);
                constant.debugLog("Capured Image Save .....");

                let imageData = new FormData();
                let objImg = {
                    name:response.fileName,
                    uri:response.uri,
                    type:response.type,
                }
                imageData.append("image", objImg);
                imageData.append("vendorId", constant.DeviceInfo.getUniqueID());
                this.forceUpdate();
                this.props.sendMessage(imageData);
            }
        });
    }


    // Render Methods
    _renderChatItem = ({ item }) => {
        let isSender = item.type === constant.kMessageTypeRequest;
        return (
            <View
                style={{
                    width: "70%",
                    // backgroundColor: "green",
                    alignSelf: isSender ? "flex-end" : "flex-start",
                    marginBottom: 20,
                    flexDirection: "row",
                }}
            >
                {isSender ? (
                    <Image
                        style={(style = [ChatScreenStyle.imgMsgStyle, { right: 0 }])}
                        resizeMode="cover"
                        source={require("../../../Resources/Images/Feedback/ChatAngleRight.png")}
                    />
                ) : (
                    <Image
                        style={[ChatScreenStyle.imgMsgStyle, { left: 0 }]}
                        resizeMode="cover"
                        source={require("../../../Resources/Images/Feedback/ChatAngleLeft.png")}
                    />
                )}
                <View
                    style={{
                        width: "96%",
                        backgroundColor: isSender ? constant.senderBGColor : "white",
                        marginLeft: isSender ? 0 : 14,
                        alignSelf: isSender ? "flex-end" : "auto",
                        borderRadius: 5,
                        borderColor: "transparent",
                        borderWidth: 1,
                        // marginBottom: 20,
                    }}
                >
                    {item.display_image === "" ? (
                        <View>
                            <Text style={{ fontFamily: constant.themeFont, fontSize: 12, margin: 2, marginLeft: 8 }}>
                                {item.message}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: constant.themeFont,
                                    fontSize: 11,
                                    alignSelf: "flex-end",
                                    margin: 2,
                                    marginRight: 8,
                                }}
                            >
                                {this._getTimeDifference(item.timestamp)}
                            </Text>
                        </View>
                    ) : (
                        // <Image resi/>
                        // <View style={{}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.showImage = item.display_image;
                                this.setState({ isShowImage: !this.state.isShowImage });
                            }}
                        >
                            <ImageLoad
                                style={{
                                    height: 135,
                                    width: "100%",
                                    // borderColor: "transparent",
                                    // borderRadius: 10,
                                    // borderWidth: 1,
                                }}
                                borderRadius={5}
                                isShowActivity={false}
                                // resizeMode="contain"
                                placeholderSource={require("../../../Resources/Images/DefaultProductImage.png")}
                                source={{
                                    uri: item.display_image,
                                }}
                            >
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: 2,
                                        right: 5,
                                        backgroundColor: "lightgray",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: constant.themeFont,
                                            fontSize: 11,
                                            alignSelf: "flex-end",
                                            color: "black",
                                            // margin: 2,
                                            // marginRight: 8,
                                        }}
                                    >
                                        {item.timeAgo}
                                    </Text>
                                </View>
                            </ImageLoad>
                        </TouchableOpacity>
                        // </View>
                    )}
                    {/* <Text style={{ fontFamily: constant.themeFont, fontSize: 12, margin: 2, marginLeft: 8 }}>
                        {item.message}
                    </Text> */}
                </View>
            </View>
        );
    };

    _renderModalForShowImage = () => {
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.state.isShowImage}
                onRequestClose={() => {
                    alert("Modal has been closed.");
                }}
            >
                <TouchableWithoutFeedback onPress={() => this.setState({ isShowImage: false })}>
                    <View
                        style={{
                            // flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "black",
                        }}
                    >
                        <View style={ChatScreenStyle.overlayViewStyle} />
                        <ImageLoad
                            style={{
                                height: "100%",
                                width: "100%",
                            }}
                            // borderRadius={5}
                            isShowActivity={false}
                            resizeMode="contain"
                            placeholderSource={require("../../../Resources/Images/DefaultProductImage.png")}
                            source={{
                                uri: this.showImage,
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    render() {
        return (
            // Main View (Container)
            <View style={ChatScreenStyle.mainContainer}>
                {/* <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView} /> */}
                {this._renderModalForShowImage()}
                <View style={{ flex: 1 }}>
                    {this.props.arrChat.length > 0 ? (
                        <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 50 }}>
                            <FlatList
                                style={{
                                    width: "95%",
                                    marginTop: 10,
                                    // height: "100%",
                                    backgroundColor: "transparent",
                                }}
                                scrollToEnd
                                ref={list => (this.chatList = list)}
                                data={this.props.arrChat}
                                keyExtractor={(item, index) => item.userChatId.toString()}
                                renderItem={this._renderChatItem.bind(this)}
                                showsHorizontalScrollIndicator={false}
                                directionalLockEnabled
                                onLayout={() => this.chatList.scrollToEnd({animated:true})}
                                // ListFooterComponent={this._renderFooter.bind(this)}
                            />
                        </View>
                    ) : (
                        <View style={{ marginBottom: 50, marginHorizontal: 16 }}>
                            <Text style={{ fontFamily: constant.themeFont, fontSize: 17, marginVertical: 8 }}>
                                {baseLocal.t("keyNoMessageTextFeedback")}
                            </Text>
                        </View>
                    )}
                    <View
                        style={{
                            height: 50,
                            flexDirection: "row",
                            position: "absolute",
                            bottom: 0,
                            justifyContent: "space-between",
                            backgroundColor: "white",
                            width: "100%",
                        }}
                    >
                        <View style={{ justifyContent: "center", alignItems: "center", width: "15%" }}>
                            <TouchableOpacity onPress={this._onPressCameraButton}>
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    resizeMode="cover"
                                    source={require("../../../Resources/Images/Feedback/cameraIcon.png")}
                                />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={{ borderColor: "transparent", borderWidth: 2, flex: 1 }}
                            placeholder="Type a message"
                            onChangeText={text => this.setState({ txtMsg: text })}
                            value={this.state.txtMsg}
                            numberOfLines={1}
                        />
                        <View style={{ justifyContent: "center", alignItems: "center", width: "20%" }}>
                            <TouchableOpacity onPress={this._onPressSendMsg}>
                                <Text
                                    style={{
                                        fontFamily: constant.themeFont,
                                        fontSize: 18,
                                        color: constant.grayShadeColor55,
                                        margin: 8,
                                    }}
                                >
                                    Send
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.props.isLoading ? (
                        <Spinner
                            visible={this.props.isLoading}
                            cancelable={true}
                            // textContent={"Please wait..."}
                            // textStyle={{ color: "#FFF" }}
                        />
                    ) : null}
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.chat.isLoading,
        isGetChatSuccess: state.chat.isGetChatSuccess,
        isSendMsgSuccess: state.chat.isSendMsgSuccess,
        arrChat: state.chat.arrChat,
        error: state.chat.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getChat: parameters =>
            dispatch({
                type: constant.actions.getChatRequest,
                payload: { endPoint: constant.APIGetChat, parameters: parameters },
            }),

        sendMessage: parameters =>
            dispatch({
                type: constant.actions.sendMessageRequest,
                payload: { endPoint: constant.APISendMessage, parameters: parameters },
            }),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatScreen);
