import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Colors from "../../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import AppHeader from "../../components/AppHeader";
import MenuCard from "../../components/MenuCard";
import StatisticCard from "../../components/StatisticCard";
import { notificationService } from "../../modules/scanner/services/NotificationService";
import { materialService } from "../../modules/scanner/services/MaterialService";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [stats, setStats] = useState({ inProduction: 0, mcDry: 0, needBaking: 0, scrap: 0 });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      notificationService.listActiveNotifications().then(list => {
        if (!cancelled) setNotificationCount(list.length);
      });

      materialService.listAllWithDerived().then(materials => {
        if (cancelled) return;
        setStats({
          inProduction: materials.filter(m => m.currentStatus === "IN_PRODUCTION").length,
          mcDry: materials.filter(m => m.currentStatus === "MC_DRY").length,
          needBaking: materials.filter(m => m.derived.needsBaking).length,
          scrap: materials.filter(m => m.currentStatus === "SCRAP").length,
        });
      });

      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <AppHeader
          title="MSL e-Part Monitoring"
          subtitle="PT Denso Indonesia — Selamat datang, Operator"
        />

        <Text style={styles.sectionTitle}>Menu</Text>

        <View style={styles.row}>
          <MenuCard icon="📥" title="Stock In" onPress={() => navigation.navigate("StockIn")} />
          <MenuCard icon="📤" title="Stock Out" onPress={() => navigation.navigate("StockOut")} />
        </View>

        <View style={styles.row}>
          <MenuCard icon="🔄" title="Return MC Dry" onPress={() => navigation.navigate("ReturnMcDry")} />
          <MenuCard icon="🔥" title="Baking" onPress={() => navigation.navigate("Baking")} badge={stats.needBaking} />
        </View>

        <View style={styles.row}>
          <MenuCard icon="📜" title="Material History" onPress={() => navigation.navigate("History")} />
          <MenuCard icon="ℹ️" title="Material Information" onPress={() => navigation.navigate("Information")} />
        </View>

        <View style={styles.row}>
          <MenuCard
            icon="🔔"
            title="Notification"
            onPress={() => navigation.navigate("Notification")}
            badge={notificationCount}
          />
          <MenuCard icon="👤" title="Profile" onPress={() => navigation.navigate("Profile")} />
        </View>

        <Text style={styles.sectionTitle}>Ringkasan Material</Text>

        <View style={styles.row}>
          <StatisticCard title="In Production" value={String(stats.inProduction)} />
          <StatisticCard title="MC Dry" value={String(stats.mcDry)} />
        </View>

        <View style={styles.row}>
          <StatisticCard title="Need Baking" value={String(stats.needBaking)} />
          <StatisticCard title="Scrap" value={String(stats.scrap)} />
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
