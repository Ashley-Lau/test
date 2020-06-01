import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, Alert} from 'react-native';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import CustButton from "../Components/CustButton";
import {useNavigation} from "@react-navigation/native";

const ProfileScreen = props => {
    const navigation = useNavigation();

    const confirmLogOut = () => {
        Alert.alert("Confirm Log Out",
            "Do you want to log out?",
            [{
                text: "Yes",
                onPress: () => navigation.navigate('LoginScreen'),
                style: 'cancel'
            },
                {text:"Cancel", onPress: () => {},  style:'cancel'}
            ],
            {cancelable: false}
        )
    }
    return <Background style = {{justifyContent: 'center'}}>
                <View style = {{}}>
                    <GradientButton style={{}} colors = {['#30cfd0','#330867']}>
                        <Text>ProfileScreen</Text>
                    </GradientButton>
                    <CustButton style={{marginTop:10,backgroundColor: '#dda0dd', marginHorizontal: 60}}
                                onPress = {confirmLogOut}>
                        <Text>Log Out</Text>
                    </CustButton>
                </View>
            </Background>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "bold",
    },
})

export default ProfileScreen;