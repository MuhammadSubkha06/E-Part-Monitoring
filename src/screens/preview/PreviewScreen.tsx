import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
} from "react-native";

import Colors from "../../constants/colors";

import AppHeader from "../../components/AppHeader";
import PrimaryButton from "../../components/PrimaryButton";

export default function PreviewScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <AppHeader
                    title="Preview Transaction"
                    subtitle="Pastikan data sudah benar"
                />

                <View style={styles.card}>
                    <InfoItem
                        label="Transaction"
                        value="Stock In"
                    />

                    <InfoItem
                        label="Part Number"
                        value="JK949628-3630"
                    />

                    <InfoItem
                        label="Lot Number"
                        value="Q42A51"
                    />

                    <InfoItem
                        label="Quantity"
                        value="25 PCS"
                    />

                    <InfoItem
                        label="Operator"
                        value="Bombom"
                    />

                    <InfoItem
                        label="Date"
                        value="28 Jul 2026"
                    />
                </View>

                <View style={{ marginTop: 25 }}>
                    <PrimaryButton
                        title="SUBMIT"
                        color={Colors.success}
                    />
                </View>

                <View style={{ marginTop: 15 }}>
                    <PrimaryButton
                        title="SCAN ULANG"
                        color={Colors.warning}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.item}>
            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={styles.value}>
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        flex: 1,
        padding: 20,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
        elevation: 3,
    },

    item: {
        marginBottom: 18,
    },

    label: {
        color: Colors.subtitle,
        fontSize: 14,
    },

    value: {
        marginTop: 5,
        fontWeight: "700",
        fontSize: 17,
        color: Colors.text,
    },
});