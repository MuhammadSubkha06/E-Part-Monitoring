import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import Colors from "../constants/colors";

interface Props {
  title: string;
  value: string;
}

export default function StatisticCard({
  title,
  value,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,

    backgroundColor: "#fff",

    margin: 6,

    padding: 18,

    borderRadius: 16,

    elevation: 3,
  },

  value: {
    fontSize: 24,

    fontWeight: "700",

    color: Colors.primary,
  },

  title: {
    marginTop: 8,

    color: Colors.subtitle,
  },
});