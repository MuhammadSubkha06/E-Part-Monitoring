import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import Colors from "../../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import AppHeader from "../../components/AppHeader";
import MenuCard from "../../components/MenuCard";
import StatisticCard from "../../components/StatisticCard";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

export default function DashboardScreen({
  navigation,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <AppHeader
          title="E Part Monitoring"
          subtitle="Selamat datang, Bombom"
        />

        <Text style={styles.sectionTitle}>
          Menu
        </Text>

        <View style={styles.row}>
          <MenuCard
            icon="📥"
            title="Stock In"
            onPress={() =>
              navigation.navigate("Scanner", {
                type: "Stock In",
              })
            }
          />

          <MenuCard
            icon="📤"
            title="Stock Out"
            onPress={() =>
              navigation.navigate("Scanner", {
                type: "Stock Out",
              })
            }
          />
        </View>

        <View style={styles.row}>
          <MenuCard
            icon="🔄"
            title="Return"
            onPress={() =>
              navigation.navigate("Scanner", {
                type: "Return",
              })
            }
          />

          <MenuCard
            icon="📜"
            title="History"
            onPress={() =>
              navigation.navigate("History")
            }
          />
        </View>

        <View style={styles.row}>
          <MenuCard
            icon="👤"
            title="Profile"
            onPress={() =>
              navigation.navigate("Profile")
            }
          />


        </View>

        <Text style={styles.sectionTitle}>
          Aktifitas Hari Ini
        </Text>

        <View style={styles.row}>
          <StatisticCard
            title="Stock In"
            value="125"
          />

          <StatisticCard
            title="Stock Out"
            value="80"
          />
        </View>

        <View style={styles.row}>
          <StatisticCard
            title="Return"
            value="12"
          />

          <StatisticCard
            title="Success"
            value="98%"
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
});