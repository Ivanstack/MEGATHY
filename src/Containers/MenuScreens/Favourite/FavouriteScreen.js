/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AppState,
    SafeAreaView,
    FlatList,
    RefreshControl,
    AsyncStorage,
    Dimensions,
} from "react-native";

// Redux
import { connect } from "react-redux";

// Common file
import CommonStyle from "../../../Helper/CommonStyle"
import * as constant from "../../../Helper/Constants";

// Lib
import Icon from "react-native-vector-icons/EvilIcons";
import ImageLoad from "react-native-image-placeholder";
import Spinner from "react-native-loading-spinner-overlay";

// Network Utility

// Components Style

import CollectionView from '../../../Helper/Components/Collection'

// Localization
import baseLocal from "../../../Resources/Localization/baseLocalization";


// Class Variable

class FavouriteScreen extends Component {
    constructor(props) {
        super(props);
        // Class Props
        (this.currentPage = 1),
            (this.lastPage = 0),
            //Class State
            (this.state = {
                arrProduct: []
            });
    }

    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("DrawerToggle");
                        }}
                    >
                        <Icon name="navicon" style={{ marginLeft: 10 }} size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={CommonStyle.headerText}>{baseLocal.t("Favourite")}</Text>
                </View>
            </View>
        ),
        headerStyle: {
            backgroundColor: "#CF2526",
        },
    });

    // App Life Cycle Methods

    async componentDidMount() {
        this.props.dispatchGetFavouriteProduct({ page: this.props.currentPage })
        console.log(global.currentUser.id);

    }

    componentWillUnmount() {

    }

    componentWillUpdate() {

    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
        if (newProps.error) {
            this.setState({ arrProduct: newProps.arrProduct })
        } else {
            this.setState({ arrProduct: newProps.arrProduct })
        }

        if (newProps.favourite.isDeleteSuccess && newProps.favourite.isDeleteSuccess != this.props.favourite.isDeleteSuccess) {
            this.props.dispatchGetFavouriteProduct({ page: newProps.lastPage })
        }
    }

    render() {
        return (
            <FlatList
                style={{
                    backgroundColor: constant.prodCategoryBGColor,
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: 10,
                }}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={this.state.isRefreshing}
                //     onRefresh={this.props.dispatchGetFavouriteProduct({page:1})}
                //     />
                // }
                ref={flatList => {
                    this.productList = flatList;
                }}
                data={this.state.arrProduct}
                extraData={this.state}
                keyExtractor={item => item.PkId}
                renderItem={this.renderItem}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled
                numColumns={2}
                onEndReached={this._callLoadMore}
            />
        )
    }

    renderItem = ({ item }) => {
        return (
            <CollectionView item={item} onSelectedMethod={(selectedItem) => { this.props.dispatchRemoveFavourite(selectedItem.PkId) }} />
        )
    }
}

function mapStateToProps(state, props) {
    console.log(state);

    return {
        favourite: state.favourite,
        isLoading: state.favourite.isLoading,
        isRefreshing: state.favourite.isRefreshing,
        isProductSuccess: state.favourite.isProductSuccess,
        arrProduct: state.favourite.arrProduct,
        currentPage: state.favourite.currentPage,
        lastPage: state.favourite.lastPage,
        error: state.favourite.error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchGetFavouriteProduct: parameters =>
            dispatch({
                type: constant.actions.getFavouriteProductRequest,
                payload: { endPoint: constant.APIGetFavouriteProducts, parameters: parameters },
            }),
        dispatchRemoveFavourite: productId =>
            dispatch({
                type: constant.actions.removeFavouriteProductRequest,
                payload: { endPoint: constant.APIRemoveFavouriteProduct + "/" + productId, parameters: "" },
            }),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FavouriteScreen);