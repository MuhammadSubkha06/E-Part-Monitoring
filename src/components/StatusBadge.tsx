import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


interface Props {

    status:
    | "Success"
    | "Stopped";

}


export default function StatusBadge({
    status
}: Props) {

    return (

        <View
            style={[
                styles.badge,
                status === "Success"
                    ? styles.success
                    : styles.stopped
            ]}
        >

            <Text style={styles.text}>
                {status}
            </Text>

        </View>

    );

}



const styles = StyleSheet.create({

    badge: {

        paddingHorizontal: 12,

        paddingVertical: 5,

        borderRadius: 20,

    },


    success: {

        backgroundColor: "#DCFCE7",

    },


    stopped: {

        backgroundColor: "#FEF3C7",

    },


    text: {

        fontSize: 12,

        fontWeight: "700",

        color: "#334155",

    }

});