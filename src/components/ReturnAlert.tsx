import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


interface Props {

    remaining: string;

}



export default function ReturnAlert({

    remaining,

}: Props) {


    return (

        <View style={styles.container}>


            <Text style={styles.title}>
                ✅ Return Success
            </Text>


            <Text style={styles.text}>
                Exposure Time Stopped
            </Text>


            <Text style={styles.text}>
                Remaining Exposure : {remaining}
            </Text>


            <Text style={styles.text}>
                Status : RETURNED
            </Text>


        </View>

    );

}



const styles = StyleSheet.create({

    container: {

        backgroundColor: "#FEF3C7",

        borderRadius: 15,

        padding: 18,

        marginTop: 20,

        borderWidth: 1,

        borderColor: "#F59E0B",

    },


    title: {

        fontSize: 17,

        fontWeight: "700",

        color: "#92400E",

        marginBottom: 8,

    },


    text: {

        fontSize: 14,

        color: "#78350F",

        marginTop: 5,

    }

});