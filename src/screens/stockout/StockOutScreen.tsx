import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from "react-native";

import React, { useState } from "react";
import ExposureAlert from "../../components/ExposureAlert";
import PrimaryButton from "../../components/PrimaryButton";
import AppHeader from "../../components/AppHeader";
import ReadOnlyField from "../../components/ReadOnlyField";

import Colors from "../../constants/colors";


export default function StockOutScreen() {
    const [submitted, setSubmitted] = useState(false);


    const stockOutTime =
        new Date().toLocaleString("id-ID");

    {
        submitted && (

            <ExposureAlert

                startTime={stockOutTime}

                exposure="168"

            />

        )
    }
    return (

        <SafeAreaView style={styles.container}>


            <ScrollView
                contentContainerStyle={styles.content}
            >


                <AppHeader

                    title="Stock Out"

                    subtitle="Informasi Part"

                />



                <ReadOnlyField

                    label="Part Number"

                    value="JK949628-3630"

                />


                <ReadOnlyField

                    label="Lot Number"

                    value="Q42A51"

                />


                <ReadOnlyField

                    label="Unique Number"

                    value="000123456789"

                />


                <ReadOnlyField

                    label="Rank"

                    value="3"

                />


                <ReadOnlyField

                    label="Expired Time"

                    value="31/12/2026"

                />


                <ReadOnlyField

                    label="Exposure Time"

                    value="168 Hours"

                />
                <View style={styles.buttonContainer}>

                    <PrimaryButton

                        title="SUBMIT STOCK OUT"

                        onPress={() => {

                            setSubmitted(true);

                        }}

                    />

                </View>

            </ScrollView>


        </SafeAreaView>

    );

}





const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },


    content: {
        padding: 20,
    },

    buttonContainer: {

        marginTop: 30,

    },


});