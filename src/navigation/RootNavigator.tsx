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

// --- Redesigned Scanner Module (modules/scanner) ---
import ModuleStockInScreen from "../modules/scanner/screens/StockInScreen";
import ModuleStockOutScreen from "../modules/scanner/screens/StockOutScreen";
import ModuleReturnMcDryScreen from "../modules/scanner/screens/ReturnMcDryScreen";
import ModuleHistoryScreen from "../modules/scanner/screens/HistoryScreen";
import ModuleInformationScreen from "../modules/scanner/screens/InformationScreen";

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

    // Redesigned Scanner Module — each module is a fully self-contained
    // scan-to-transaction flow (see src/modules/scanner).
    ModuleStockIn: undefined;
    ModuleStockOut: undefined;
    ModuleReturnMcDry: undefined;
    ModuleHistory: undefined;
    ModuleInformation: undefined;

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

                <Stack.Screen
                    name="ModuleStockIn"
                    component={ModuleStockInScreen}
                />

                <Stack.Screen
                    name="ModuleStockOut"
                    component={ModuleStockOutScreen}
                />

                <Stack.Screen
                    name="ModuleReturnMcDry"
                    component={ModuleReturnMcDryScreen}
                />

                <Stack.Screen
                    name="ModuleHistory"
                    component={ModuleHistoryScreen}
                />

                <Stack.Screen
                    name="ModuleInformation"
                    component={ModuleInformationScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}