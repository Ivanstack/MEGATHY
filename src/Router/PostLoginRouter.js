import { StackNavigator } from "react-navigation";

import CityScreen from "../Containers/PostLoginScreens/CityScreen";
import AreaScreen from "../Containers/PostLoginScreens/AreaScreen";
import StoreScreen from "../Containers/PostLoginScreens/StoreScreen";

// Main Navigation Flow
const PostLoginNav = StackNavigator(
    {
        CityScreen: { screen: CityScreen },
        AreaScreen: { screen: AreaScreen },
        StoreScreen: { screen: StoreScreen},
    },
    {
        headerMode: "none",
        navigationOptions: {
            headerVisible: false,
        },
    }
);

// Navigation Option
// LoginNav.navigationOptions = {
//     header: null,
//     gesturesEnabled: false,
// };

export default PostLoginNav;
