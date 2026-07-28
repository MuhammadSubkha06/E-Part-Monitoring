import React from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import {
    NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
    RootStackParamList,
} from "../../navigation/RootNavigator";

import Colors from "../../constants/colors";

import AppHeader from "../../components/AppHeader";
import ResultCard from "../../components/ResultCard";
import PrimaryButton from "../../components/PrimaryButton";


type Props = NativeStackScreenProps<
    RootStackParamList,
    "Scanner"
>;


export default function ScannerScreen({
    route,
    navigation,
}: Props) {


    const scanResult = {
        partNumber: "JK949628-3630",
        lotNumber: "Q42A51",
        uniqueNumber: "000123456789",
    };


    return (

        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >


                <AppHeader
                    title={route.params.type}
                    subtitle="Arahkan kamera ke barcode"
                />



                <View style={styles.cameraBox}>

                    <Text style={styles.cameraIcon}>
                        📷
                    </Text>

                    <Text style={styles.cameraText}>
                        Camera Preview
                    </Text>

                </View>



                <View style={styles.row}>

                    <TouchableOpacity
                        style={styles.toolButton}
                        activeOpacity={0.7}
                    >
                        <Text>
                            ⚡ Flash
                        </Text>
                    </TouchableOpacity>

                </View>


                <ResultCard

                    partNumber={
                        scanResult.partNumber
                    }

                    lotNumber={
                        scanResult.lotNumber
                    }

                    uniqueNumber={
                        scanResult.uniqueNumber
                    }

                />



                <View
                    style={{
                        marginTop: 25,
                    }}
                >

                    <PrimaryButton

                        title="LANJUT"

                        onPress={() => {

                            if (route.params.type === "Stock In") {
                                navigation.navigate(
                                    "StockInManual",
                                    {
                                        partNumber: scanResult.partNumber,
                                        lotNumber: scanResult.lotNumber,
                                        uniqueNumber: scanResult.uniqueNumber,
                                    }
                                );
                            }


                            if (route.params.type === "Stock Out") {
                                navigation.navigate(
                                    "StockOut"
                                );
                            }

                            if (route.params.type === "Return") {
                                navigation.navigate(
                                    "Return"
                                );
                            }
                        }}
                    />

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor:
            Colors.background,

    },


    content: {

        padding: 20,

        paddingBottom: 50,

    },


    cameraBox: {

        height: 280,

        borderRadius: 20,

        borderWidth: 2,

        borderStyle: "dashed",

        borderColor:
            Colors.primary,

        justifyContent:
            "center",

        alignItems:
            "center",

        backgroundColor:
            "#FFFFFF",

        marginTop: 20,

    },


    cameraIcon: {

        fontSize: 60,

    },


    cameraText: {

        marginTop: 15,

        fontSize: 16,

        color:
            Colors.subtitle,

    },


    row: {

        flexDirection:
            "row",

        justifyContent:
            "space-between",

        marginTop: 20,

    },


    toolButton: {

        width:
            "100%",

        height:
            50,

        backgroundColor:
            "#FFFFFF",

        borderRadius:
            12,

        justifyContent:
            "center",

        alignItems:
            "center",

        elevation:
            3,

    },


});