import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import AppHeader from "../../components/AppHeader";
import PrimaryButton from "../../components/PrimaryButton";
import Colors from "../../constants/colors";

type Props = NativeStackScreenProps<
    RootStackParamList,
    "StockInManual"
>;

export default function StockInManualScreen({
    route,
    navigation,
}: Props) {
    const [rank, setRank] = useState("");
    const [expiredTime, setExpiredTime] = useState("");

    const {
        partNumber,
        lotNumber,
        uniqueNumber,
    } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                <AppHeader
                    title="Stock In"
                    subtitle="Lengkapi data sebelum submit"
                />


                <View style={styles.group}>
                    <Text style={styles.label}>Part Number</Text>

                    <TextInput
                        value={partNumber}
                        editable={false}
                        style={styles.readOnly}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Lot Number</Text>

                    <TextInput
                        value={lotNumber}
                        editable={false}
                        style={styles.readOnly}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Unique Number</Text>

                    <TextInput
                        value={uniqueNumber}
                        editable={false}
                        style={styles.readOnly}
                    />
                </View>


                <View style={styles.group}>
                    <Text style={styles.label}>Rank</Text>

                    <TextInput
                        placeholder="Masukkan Rank"
                        value={rank}
                        onChangeText={setRank}
                        style={styles.input}
                    />
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Expired Time</Text>

                    <TextInput
                        placeholder="Contoh : 31/12/2026"
                        value={expiredTime}
                        onChangeText={setExpiredTime}
                        style={styles.input}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title="LANJUT"
                        color="#16A34A"
                        onPress={() =>
                            navigation.navigate("Preview", {
                                partNumber,
                                lotNumber,
                                uniqueNumber,
                                rank,
                                expiredTime,
                            })
                        }
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    group: {
        marginTop: 18,
    },

    label: {
        marginBottom: 8,
        fontWeight: "600",
        color: Colors.text,
    },

    readOnly: {
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        color: "#64748B",
        borderWidth: 1,
        borderColor: "#CBD5E1",
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },

    buttonContainer: {
        marginTop: 30
    }

});