import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


interface Props {

    startTime: string;

    exposure: string;

}


export default function ExposureAlert({
    startTime,
    exposure,
}: Props) {

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                ✅ Stock Out Success
            </Text>


            <Text style={styles.text}>
                Exposure Time Running
            </Text>


            <Text style={styles.text}>
                Limit : {exposure} Hours
            </Text>


            <Text style={styles.text}>
                Start : {startTime}
            </Text>


        </View>

    );

}



const styles = StyleSheet.create({

    container: {

        backgroundColor: "#DCFCE7",

        borderRadius: 15,

        padding: 18,

        marginTop: 20,

        borderWidth: 1,

        borderColor: "#22C55E"

    },


    title: {

        fontSize: 17,

        fontWeight: "700",

        color: "#166534",

        marginBottom: 8,

    },


    text: {

        fontSize: 14,

        color: "#14532D",

        marginTop: 5,

    }

});