import { StackNavigator } from "react-navigation";

import LoginScreen from "../Containers/LoginScreens/LoginScreen";
import SignUpScreen from "../Containers/LoginScreens/SignUpScreen";
import ForgotPasswordScreen from "../Containers/LoginScreens/ForgotPasswordScreen";
import VerifyCodeScreen from "../Containers/LoginScreens/VerifyCodeScreen";
import ResetPasswordScreen from "../Containers/LoginScreens/ResetPasswordScreen";

// Main Navigation Flow
const LoginNav = StackNavigator(
    {
        LoginScreen: { screen: LoginScreen },
        SignUpScreen: { screen: SignUpScreen },
        ForgotPasswordScreen: { screen: ForgotPasswordScreen },
        VerifyCodeScreen: { screen: VerifyCodeScreen },
        ResetPasswordScreen: { screen: ResetPasswordScreen },
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

export default LoginNav;
