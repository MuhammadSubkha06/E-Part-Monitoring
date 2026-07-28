import React from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";


import AppHeader from "../../components/AppHeader";
import PrimaryButton from "../../components/PrimaryButton";
import Colors from "../../constants/colors";


export default function HistoryDetailScreen() {

    return (

        <SafeAreaView style={styles.container}>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >


                <AppHeader

                    title="Transaction Detail"

                    subtitle="Detail transaksi"

                />



                <View style={styles.card}>


                    <Item

                        label="Transaction"

                        value="Stock Out"

                    />


                    <Item

                        label="Status"

                        value="Success"

                    />


                    <Item

                        label="Part Number"

                        value="JK949628-3630"

                    />


                    <Item

                        label="Lot Number"

                        value="Q42A51"

                    />


                    <Item

                        label="Unique Number"

                        value="000123456789"

                    />


                    <Item

                        label="Rank"

                        value="3"

                    />


                    <Item

                        label="Expired Time"

                        value="31/12/2026"

                    />


                    <Item

                        label="Exposure Limit"

                        value="168 Hours"

                    />


                    <Item

                        label="Exposure Status"

                        value="Running"

                    />


                    <Item

                        label="Exposure Start"

                        value="28 Jul 2026 09:30"

                    />


                    <Item

                        label="Operator"

                        value="Bombom"

                    />


                    <Item

                        label="Warehouse"

                        value="MC Dry"

                    />


                    <Item

                        label="Date"

                        value="28 Jul 2026 09:30"

                    />


                </View>




                <View style={styles.buttonContainer}>


                    <PrimaryButton

                        title="BACK"

                    />


                </View>



            </ScrollView>


        </SafeAreaView>

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

    container: {

        flex: 1,

        backgroundColor:
            Colors.background,

    },


    content: {

        padding: 20,

        paddingBottom: 50,

    },


    card: {

        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        padding: 20,

        marginTop: 20,

        elevation: 3,

    },


    item: {

        marginBottom: 18,

    },


    label: {

        fontSize: 13,

        color:
            Colors.subtitle,

    },


    value: {

        marginTop: 5,

        fontSize: 17,

        fontWeight: "700",

        color:
            Colors.text,

    },


    buttonContainer: {

        marginTop: 30,

    },


});