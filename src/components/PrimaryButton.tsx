import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import Colors from "../constants/colors";

interface Props {
    title: string;
    color?: string;
    onPress?: () => void;
}

export default function PrimaryButton({
  title,
  color = Colors.primary,
  onPress,
}: Props){
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: color,
                },
            ]}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 55,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
});