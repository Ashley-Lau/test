import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    ScrollView,
    Image,
    Button,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import firebase from 'firebase';

import Background from "../views/Background";
import GradientButton from "../Components/GradientButton";
import HostGameItem from "../Components/HostGameItem";
import UpcomingGameItem from "../Components/UpcomingGameItem";
import firebaseDb from "../firebaseDb";
import GameItem from "../Components/GameItem";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const ProfileScreen = props => {
    const navigation = useNavigation();

    // GETTING USER DATA ================================================================================================
    const user = props.route.params.user
    const [data, setData] = useState({
        firstName:  user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        birthDate: user.birthDate,
        email: user.email,
        id: user.id,
        uri: user.uri,
        upcoming_games: user.upcoming_games
    })

    //GETTING UPCOMING GAMES =========================================================================================================
    const [upcomingGameList, setList] = useState([])

    // const updateUpcoming = () => {
    //     firebaseDb.firestore().collection('users').doc(data.id)
    //         .onSnapshot(doc => {
    //             setData({...data, upcoming_games: doc.data().upcoming_games}
    //             )
    //         })
    //     console.log(data.upcoming_games)
    // }

    const getUpcoming = () => {
        let gameList = [];
        data.upcoming_games.map(id => {
            firebaseDb.firestore().collection('game_details').doc(id)
                .onSnapshot(doc => {
                    gameList.push({key:id, value:doc.data()})
                })
        })
        setList([...upcomingGameList,...gameList])
    }

    useEffect(() => {
        getUpcoming()
    }, [])



    //MODAL STATES =======================================================================================================
    const[hostGame, setHostGame] = useState(false);

    //UPDATING USER DATA ================================================================================================
    const handleData = values => {
        if(values.password !== '') {
            firebaseDb.auth().currentUser.updatePassword(values.password).then()
                .catch(error => error)
        }
        firebaseDb.firestore().collection('users')
            .doc(data.id).update({
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            uri: values.uri,
            password: values.password !== '' ? values.password : data.password,
        }).then(() => {
            setData({
                ...data,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                uri: values.uri,
                password: values.password !== '' ? values.password : data.password,
            })
        }).catch(error => {
            console.log(error)
            alert(error)
        })
    }


    //LOG OUT FUNCTION ================================================================================================
    const logout = () => {
        Alert.alert("Confirm Log Out",
            "Do you want to log out?",
            [{
                text: "Yes",
                onPress: () => firebaseDb.auth().signOut(),
                style: 'cancel'
            },
                {text:"Cancel", onPress: () => {},  style:'cancel'}
            ],
            {cancelable: false}
        )
    }

    return <Background>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style = {{alignItems: 'center', paddingBottom: 30,}}>
                        <View style = {{...style.elevatedComponent, height: 300, justifyContent: 'space-evenly'}}>

                            <View style = {{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5,}}>
                                <View style = {style.photoFrame}>
                                    <Image style = {{height: 85, width: 85, borderRadius: 170}} source = {{
                                        uri: data.uri
                                    }}/>
                                </View>
                                <HostGameItem visible={hostGame}
                                              closeHost={() =>setHostGame(false)}
                                              uid ={data.id}
                                              username = {data.username}
                                              upcoming = {data.upcoming_games}
                                />
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {['#1bb479','#026c45']}
                                                textStyle = {{fontSize: 15}}
                                                onPress = {() => navigation.navigate('UpdateDetailScreen', {data: data, handler: handleData.bind(this)})}>
                                    Update details
                                </GradientButton>
                                <GradientButton style={{width: 120, height:37, marginTop: 20,}}
                                                colors = {["red", "maroon"]}
                                                onPress = {logout}
                                                textStyle = {{fontSize: 15}}>
                                    Log Out
                                </GradientButton>
                            </View>

                            <View style = {{paddingLeft: 30, marginTop: 10}}>
                                <Text style = {{fontSize: 20}}> Name: {data.firstName} {data.lastName}</Text>
                                <Text style = {{fontSize: 20}}> Username: {data.username} </Text>
                                <Text style = {{fontSize: 20}}> Email: {data.email}</Text>
                                <Text style = {{fontSize: 20}}> DOB: {data.birthDate.toDate().toString().slice(4,15)}</Text>
                            </View>

                            <GradientButton style={{width: "95%", height:"14%", marginTop: 15, alignSelf: 'center'}}
                                            colors = {['#1bb479','#026c45']}
                                            onPress={() => setHostGame(true)}
                                            textStyle = {{fontSize: 20}}>
                                Host Game
                            </GradientButton>
                        </View>
                        <View style = {{...style.elevatedComponent, marginTop: 20, height: 200}}>
                            <View style = {style.titleBackground} >
                                <Text style ={style.titleText}>
                                    Upcoming Games
                                </Text>
                            </View>
                            {data.upcoming_games.length < 0
                                ? <View>
                                    <Text>No Upcoming Games!</Text>
                                </View>

                                :upcomingGameList.length > 0
                                    ?<ScrollView nestedScrollEnabled={true}>
                                        {upcomingGameList.map(game =>
                                            (
                                                <UpcomingGameItem key={game.key}
                                                                  gameDetails={game.value}
                                                                  gameId={game.key}
                                                                  user={user.id}
                                                />
                                            )
                                        )}
                                    </ScrollView>

                                    : <View style={{justifyContent:"center", alignItems:"center"}}>
                                        <TouchableOpacity onPress={() => {
                                            getUpcoming()

                                        }} >
                                            <MaterialCommunityIcons name="refresh" size ={25}/>
                                        </TouchableOpacity>

                                        <Text>Please Refresh!</Text>
                                    </View>
                            }
                        </View>
                        <View style = {{...style.elevatedComponent, marginTop:20, height: 200}}>
                            <View style = {style.titleBackground}>
                                <Text style ={style.titleText}>
                                    Referee applications
                                </Text>
                            </View>
                        </View>
                        <View style = {{...style.elevatedComponent, marginTop:20, height: 200}}>
                            <View style = {style.titleBackground}>
                                <Text style ={style.titleText}>
                                    Upcoming Refereeing Games
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Background>
}

const style = StyleSheet.create({
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
    elevatedComponent: {
        width: '90%',
        height: 150,
        elevation: 10,
        backgroundColor: 'white',
        marginTop: 40,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    titleBackground: {
        backgroundColor: 'green',
        height: 40,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    titleText: {
        textDecorationLine: 'underline',
        fontSize: 25,
        marginTop: 2,
        marginLeft: 4,
        fontWeight: '500',
        color: 'white',
    },
    photoFrame: {
        height: 85,
        width: 85,
        borderRadius: 170,
        elevation: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
        justifyContent: 'center',
        backgroundColor: 'white',
    }
})

export default ProfileScreen;
