import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";

import Colors from "../constants/colors";

interface Props {
  title: string;
  icon: string;
  onPress?: () => void;
  badge?: number;
}

export default function MenuCard({
  title,
  icon,
  onPress,
  badge,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {!!badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? "9+" : badge}</Text>
        </View>
      )}

      <Text style={styles.icon}>
        {icon}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,

    height: 130,

    backgroundColor: "#fff",

    margin: 8,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",

    elevation: 4,

    position: "relative",
  },

  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  icon: {
    fontSize: 36,
  },

  title: {
    marginTop: 10,

    fontSize: 16,

    fontWeight: "700",

    color: Colors.text,
  },
});