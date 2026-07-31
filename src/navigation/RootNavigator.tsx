import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import LoginScreen from "../screens/login/LoginScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// MSL e-Part Monitoring System — scan-to-transaction modules.
// Each screen is a fully self-contained flow (scan -> validate -> confirm)
// backed by the Repository/Service/Model layers in src/modules/scanner.
import StockInScreen from "../modules/scanner/screens/StockInScreen";
import StockOutScreen from "../modules/scanner/screens/StockOutScreen";
import ReturnMcDryScreen from "../modules/scanner/screens/ReturnMcDryScreen";
import HistoryScreen from "../modules/scanner/screens/HistoryScreen";
import InformationScreen from "../modules/scanner/screens/InformationScreen";
import BakingScreen from "../modules/scanner/screens/BakingScreen";
import NotificationScreen from "../modules/scanner/screens/NotificationScreen";

export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;

    StockIn: undefined;
    StockOut: undefined;
    ReturnMcDry: undefined;
    History: undefined;
    Information: { materialId?: string } | undefined;
    Baking: undefined;
    Notification: undefined;

    Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />

                <Stack.Screen name="StockIn" component={StockInScreen} />
                <Stack.Screen name="StockOut" component={StockOutScreen} />
                <Stack.Screen name="ReturnMcDry" component={ReturnMcDryScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Information" component={InformationScreen} />
                <Stack.Screen name="Baking" component={BakingScreen} />
                <Stack.Screen name="Notification" component={NotificationScreen} />

                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
