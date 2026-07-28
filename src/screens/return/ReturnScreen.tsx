import React, { useState } from "react";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from "react-native";

import PrimaryButton from "../../components/PrimaryButton";
import ReturnAlert from "../../components/ReturnAlert";

import AppHeader from "../../components/AppHeader";
import ReadOnlyField from "../../components/ReadOnlyField";

import Colors from "../../constants/colors";


export default function ReturnScreen() {
    const [submitted, setSubmitted] = useState(false);
    return (

        <SafeAreaView style={styles.container}>


            <ScrollView
                contentContainerStyle={styles.content}
            >


                <AppHeader

                    title="Return MC Dry"

                    subtitle="Exposure Remaining"

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

                    label="Exposure Limit"

                    value="168 Hours"

                />



                <ReadOnlyField

                    label="Used Exposure"

                    value="45 Hours"

                />



                <ReadOnlyField

                    label="Remaining Exposure"

                    value="123 Hours"

                />

                {
                    submitted && (

                        <ReturnAlert

                            remaining="123 Hours"

                        />

                    )
                }

                <View style={styles.buttonContainer}>


                    <PrimaryButton

                        title="SUBMIT RETURN"

                        color="#F59E0B"

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