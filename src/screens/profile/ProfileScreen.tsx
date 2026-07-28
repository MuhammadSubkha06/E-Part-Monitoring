import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import Colors from "../../constants/colors";
import AppHeader from "../../components/AppHeader";
import ProfileItem from "../../components/ProfileItem";
import PrimaryButton from "../../components/PrimaryButton";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AppHeader
          title="Profile"
          subtitle="Informasi Operator"
        />

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            👤
          </Text>
        </View>

        <Text style={styles.name}>
          Bombom
        </Text>

        <Text style={styles.role}>
          Operator Warehouse
        </Text>

        <View style={{ marginTop: 30 }}>
          <ProfileItem
            label="Username"
            value="bombom"
          />

          <ProfileItem
            label="Shift"
            value="Morning"
          />

          <ProfileItem
            label="Version"
            value="1.0.0"
          />
        </View>

        <View style={{ marginTop: 25 }}>
          <PrimaryButton
            title="LOGOUT"
            color="#EF4444"
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
    padding: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  avatarText: {
    fontSize: 50,
    color: "#fff",
  },

  name: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },

  role: {
    textAlign: "center",
    color: Colors.subtitle,
    marginTop: 5,
    fontSize: 15,
  },
});