import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import Colors from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import StatusBadge from "../../components/StatusBadge";
import { history } from "../../utils/history";

type Props = NativeStackScreenProps<
    RootStackParamList,
    "History"
>;

export default function HistoryScreen({
    navigation,
}: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <AppHeader
                    title="History"
                    subtitle="Riwayat transaksi"
                />

                <TextInput
                    placeholder="Cari Part Number..."
                    style={styles.search}
                />

                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate("HistoryDetail")}
                        >
                            <View style={styles.row}>
                                <Text style={styles.type}>
                                    {item.type}
                                </Text>

                                <StatusBadge
                                    status={
                                        item.status as
                                        | "Success"
                                        | "Stopped"
                                    }
                                />
                            </View>

                            <Text style={styles.part}>
                                {item.part}
                            </Text>

                            <Text style={styles.detail}>
                                {item.lot} • Qty {item.qty}
                            </Text>

                            <Text style={styles.date}>
                                {item.date}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
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

    search: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 15,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    type: {
        fontWeight: "700",
        fontSize: 16,
    },

    part: {
        marginTop: 10,
        fontSize: 17,
        fontWeight: "700",
    },

    detail: {
        marginTop: 5,
        color: "#64748B",
    },

    date: {
        marginTop: 10,
        fontSize: 12,
        color: "#94A3B8",
    },
});