import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import Colors from "../constants/colors";

interface Props {
  title: string;
  icon: string;
  onPress?: () => void;
}

export default function MenuCard({
  title,
  icon,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
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