import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";
import HistoryDetailScreen from "../screens/history/HistoryDetailScreen";
import LoginScreen from "../screens/login/LoginScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ScannerScreen from "../screens/scanner/ScannerScreen";
import PreviewScreen from "../screens/preview/PreviewScreen";
import HistoryScreen from "../screens/history/HistoryScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import StockInManualScreen from "../screens/stockin/StockInManualScreen";
import StockOutScreen from "../screens/stockout/StockOutScreen";
import ReturnScreen from "../screens/return/ReturnScreen";

export type RootStackParamList = {

    Login: undefined;

    Dashboard: undefined;

    Scanner: {
        type: "Stock In" | "Stock Out" | "Return";
    };

    StockInManual: {
        partNumber: string;
        lotNumber: string;
        uniqueNumber: string;
    };

    Preview: {
        partNumber: string;
        lotNumber: string;
        uniqueNumber: string;
        rank: string;
        expiredTime: string;
    };

    StockOut: undefined;

    Return: undefined;

    Success: undefined;

    History: undefined;

    HistoryDetail: undefined;

    Profile: undefined;

};

const Stack =
    createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                />

                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                />

                <Stack.Screen
                    name="Scanner"
                    component={ScannerScreen}
                />

                <Stack.Screen
                    name="StockInManual"
                    component={StockInManualScreen}
                />

                <Stack.Screen
                    name="Preview"
                    component={PreviewScreen}
                />

                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                />

                <Stack.Screen
                    name="StockOut"
                    component={StockOutScreen}
                />


                <Stack.Screen
                    name="Return"
                    component={ReturnScreen}
                />

                <Stack.Screen
                    name="HistoryDetail"
                    component={HistoryDetailScreen}
                />

                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}