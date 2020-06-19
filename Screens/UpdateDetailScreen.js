import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, Alert,} from 'react-native'

import {useNavigation} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {Formik} from 'formik';
import * as yup from 'yup';


import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import CustButton from "../Components/CustButton";
import SignUpComponent from "../Components/SignUpComponent";

const reviewSchema = (password) => yup.object({
    firstName: yup.string().label('First Name').required(),
    lastName: yup.string().label('Last Name').required(),
    username: yup.string().label('Username').required().min(6).max(16),
    newPassword: yup.string().label('Password').min(6).max(16),
    confirmPassword: yup.string().label('Confirm Password')
        .oneOf([yup.ref('newPassword'), null], 'New Passwords must match'),
    currentPassword: yup.string().label('Current Password')
        .when('confirmPassword', {
            is: val=> val !== undefined ,
            then: yup.string().required().test("Checker", 'Current Password does not match', val => val === password),
            otherwise: yup.string().notRequired(),
        }),
})

const UpdateDetailScreen = (props) => {
    const navigation = useNavigation()
    // const [data, setData] = useState({
    //     ...props.route.params.data
    // })

    // const handleData = values => {
    //     setData({
    //         ...data,
    //         values,
    //     })
    // }

    const registeredPress = () => {
        navigation.navigate('ProfileScreen');
    }

    return (
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background>
                <View style = {{alignItems: 'center', marginTop: 30}}>
                    <Text style = {style.titleStyle} >Update Details</Text>
                </View>
                <View style = {{marginTop: 20, marginHorizontal: 52}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Formik
                            initialValues = {{  firstName: props.route.params.data.firstName,
                                                lastName: props.route.params.data.lastName,
                                                username: props.route.params.data.username,
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: '',}}
                            validationSchema = {reviewSchema(props.route.params.data.password)}
                            onSubmit={(values, actions) => {
                                props.route.params.handler({
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    username: values.username,
                                    password: values.confirmPassword,
                                })
                                actions.resetForm()
                                registeredPress()
                            }}
                        >
                            {(props) => (
                                <View>
                                    <SignUpComponent title = 'First Name:'
                                                     placeholder = "First Name"
                                                     onChangeText = {props.handleChange('firstName')}
                                                     value = {props.values.firstName}
                                                     onBlur = {props.handleBlur('firstName')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.firstName && props.errors.firstName}</Text>
                                    <SignUpComponent title = 'Last Name:'
                                                     placeholder = "Last Name"
                                                     onChangeText = {props.handleChange('lastName')}
                                                     value = {props.values.lastName}
                                                     onBlur = {props.handleBlur('lastName')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.lastName && props.errors.lastName}</Text>
                                    <SignUpComponent title = 'Username:'
                                                     placeholder = "6 - 16 characters"
                                                     onChangeText = {props.handleChange('username')}
                                                     value = {props.values.username}
                                                     onBlur = {props.handleBlur('username')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.username && props.errors.username}</Text>
                                    <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 10,}}>Fill in this section to update your password(Optional).</Text>
                                    <SignUpComponent title = 'Current Password:'
                                                     placeholder = "Current Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('currentPassword')}
                                                     value = {props.values.currentPassword}
                                                     onBlur = {props.handleBlur('password')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.currentPassword && props.errors.currentPassword}</Text>
                                    <SignUpComponent title = 'New Password:'
                                                     placeholder = "New Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('newPassword')}
                                                     value = {props.values.newPassword}
                                                     onBlur = {props.handleBlur('password')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.newPassword && props.errors.newPassword}</Text>
                                    <SignUpComponent title = 'Confirm New Password:'
                                                     placeholder = "Re-Enter Password"
                                                     secureTextEntry = {true}
                                                     onChangeText = {props.handleChange('confirmPassword')}
                                                     value = {props.values.confirmPassword}
                                                     onBlur = {props.handleBlur('confirmPassword')}/>
                                    <Text style={{fontSize: 15, color: 'red'}}>{props.touched.confirmPassword && props.errors.confirmPassword}</Text>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingBottom: 100}}>
                                        <GradientButton onPress={() => { registeredPress(); props.handleReset();}}
                                                        style={style.button}
                                                        colors={["rgba(179,43,2,0.84)", "#7b0303"]}>
                                            Cancel
                                        </GradientButton>
                                        <GradientButton onPress={props.handleSubmit}
                                                        style={style.button}
                                                        colors={['#1bb479','#026c45']}>
                                            Update
                                        </GradientButton>
                                    </View>
                                </View>
                            )}
                            </Formik>
                        </ScrollView>
                </View>
            </Background>
        </TouchableWithoutFeedback>)
}

const style = StyleSheet.create({
    titleStyle: {
        fontWeight: "bold",
        fontSize: 30,
        borderBottomWidth: 4,
        borderBottomColor: 'black'
    }
})

export default UpdateDetailScreen;