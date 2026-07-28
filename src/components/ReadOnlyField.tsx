import React from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from "react-native";

import Colors from "../constants/colors";


interface Props {
    label:string;
    value:string;
}


export default function ReadOnlyField({
    label,
    value,
}:Props){

return (

<View style={styles.group}>

<Text style={styles.label}>
{label}
</Text>


<TextInput

value={value}

editable={false}

style={styles.input}

/>


</View>

);

}


const styles = StyleSheet.create({

group:{
    marginTop:18,
},


label:{
    marginBottom:8,
    fontWeight:"600",
    color:Colors.text,
},


input:{

    height:52,

    backgroundColor:"#E2E8F0",

    borderRadius:12,

    paddingHorizontal:15,

    color:"#475569",

},

});