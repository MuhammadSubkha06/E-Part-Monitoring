import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import Colors from "../constants/colors";

interface Props {
  label: string;
  value: string;
}

export default function ProfileItem({
  label,
  value,
}: Props) {
  return (
    <View style={styles.container}>
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
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },

  label: {
    color: Colors.subtitle,
    fontSize: 13,
  },

  value: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
});