import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import Colors from "../constants/colors";


interface Props {

    partNumber: string;

    lotNumber: string;

    uniqueNumber: string;

}



export default function ResultCard({

    partNumber,

    lotNumber,

    uniqueNumber,

}: Props) {


    return (

        <View style={styles.card}>


            <Text style={styles.title}>
                Scan Result
            </Text>



            <Item
                label="Part Number"
                value={partNumber}
            />


            <Item
                label="Lot Number"
                value={lotNumber}
            />


            <Item
                label="Unique Number"
                value={uniqueNumber}
            />


        </View>

    );

}



function Item({

    label,

    value,

}: {

    label: string;

    value: string;

}) {


    return (

        <View style={styles.item}>

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

    card: {

        backgroundColor: "#fff",

        borderRadius: 18,

        padding: 20,

        marginTop: 20,

        elevation: 3,

    },


    title: {

        fontSize: 18,

        fontWeight: "700",

        color: Colors.text,

        marginBottom: 15,

    },


    item: {

        marginBottom: 15,

    },


    label: {

        fontSize: 13,

        color: Colors.subtitle,

    },


    value: {

        marginTop: 5,

        fontSize: 16,

        fontWeight: "700",

        color: Colors.text,

    },


});