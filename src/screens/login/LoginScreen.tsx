import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import Colors from "../../constants/colors";
import PrimaryButton from "../../components/PrimaryButton";
import AppHeader from "../../components/AppHeader";


type Props = NativeStackScreenProps<
    RootStackParamList,
    "Login"
>;

export default function LoginScreen({
    navigation,
}: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const localUsername = "Saya Buruk";
    const localPassword = "Pundung";

    const handleLogin = () => {
        if (username.trim() === localUsername && password === localPassword) {
            navigation.replace("Dashboard");
        } else if(username === "" && password === ""){
            Alert.alert(
                "Login Gagal",
                "Username atau password tidak boleh kosong"
            )
        }else {
            Alert.alert(
                "Login Gagal",
                "Username atau password salah."
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <AppHeader
                    title="E Part Monitoring"
                    subtitle="Login untuk melanjutkan"
                />

                <Text style={styles.label}>Username</Text>

                <TextInput
                    placeholder="Masukkan username"
                    placeholderTextColor="#94A3B8"
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.label}>Password</Text>

                <TextInput
                    placeholder="Masukkan password"
                    placeholderTextColor="#94A3B8"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <View style={{ marginTop: 25 }}>
                    <PrimaryButton
                        title="LOGIN"
                        onPress={() => handleLogin()}
                    />
                </View>

                <Text style={styles.version}>
                    Version 1.0.0
                </Text>
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
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    logo: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 8,
        marginTop: 1,
    },

    input: {
        height: 55,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
    },

    version: {
        marginTop: 30,
        textAlign: "center",
        color: Colors.subtitle,
        fontSize: 13,
    },
});