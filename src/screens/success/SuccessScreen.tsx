import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import Colors from "../../constants/colors";
import PrimaryButton from "../../components/PrimaryButton";

export default function SuccessScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.icon}>
          ✅
        </Text>

        <Text style={styles.title}>
          Transaction Success
        </Text>

        <Text style={styles.subtitle}>
          Data berhasil diproses
        </Text>

        <View style={{ marginTop: 40 }}>
          <PrimaryButton
            title="SCAN LAGI"
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <PrimaryButton
            title="DASHBOARD"
          />
        </View>

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
    padding: 24,
  },

  icon: {
    fontSize: 80,
    textAlign: "center",
  },

  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: Colors.subtitle,
    fontSize: 16,
  },
});