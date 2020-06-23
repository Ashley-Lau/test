import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, Alert, TouchableOpacity} from 'react-native';
import firebase from 'firebase';

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
// import BackgroundTrial from "../views/BackgroundTrial";
import firebaseDb from "../firebaseDb";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



const GameScreen = (props) => {


    // FOR SEARCH FUNCTION ================================================================================================
    const [filteredList, findFilteredList] = useState(game);
    const [searching, findSearching] = useState("");

    //need to refine search method
    const filterList = () => {
        findFilteredList([])

        let filtering = game.map(a => a.value);
        if (searching.length !== 0) {
            let temp = []
            for (let i = 0; i < filtering.length; i++) {
                for (let j = 0; j < 3; j++) {
                    if (typeof filtering[i][j] === "string") {
                        if (filtering[i][j].toLowerCase().includes(searching.toLowerCase())) {
                            temp.push(game[i])
                            break
                        }
                    }
                }
            }
            findFilteredList(temp)
        } else {
            findFilteredList(game);
        }
    }

    const searchHandler = (enteredSearch) => {
        findSearching(enteredSearch)
        filterList()
    }

    const [game, setGame] = useState ([]);
    const[uid, setUid] = useState('')

    //UID OF USER ================================================================================================
    const currentUser = props.route.params.user.id;
    // console.log(props.route.params.user.username)

    //UPDATING AND QUERYING OF GAME DETAILS ================================================================================================

    const gamesRef = firebaseDb.firestore().collection('game_details');
    const allGames = () => {
        gamesRef.get()
            . then(snapshot => {
                const someGame =[];
                const now = new Date().getTime();
                snapshot.forEach( doc => {
                        const d = doc.data()
                        //deletes gameitems that are overdue and
                        //will not display game items that do not have slots left
                        if (d.date.toMillis() < now) {
                            doc.ref.delete().then(() => {
                            })
                        } else if (d.availability <= 0){

                        } else {
                            someGame.push({key: doc.id, value: doc.data()});
                        }
                    }
                )
                setGame(someGame)
            })

            .catch(err => {
                Alert.alert("error", err);
            });
    }


    return (<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            <Background style = {styles.container}>
                <View style={styles.searchSpace}>
                    <View style={styles.searchBar}>
                        <TextInput style={styles.searchInput}
                                   placeholder=" Keywords, Location, HostName"
                                   placeholderTextColor="#B9B9B9"
                                   onChangeText={searchHandler}
                                   value={searching}
                        />
                        {/*<SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {filterList(); console.log(filteredList); Keyboard.dismiss();}}/>*/}
                        <SearchButtons style={{flex: 1, elevation: 5}} searchMe={() => {console.log(uid);Keyboard.dismiss();}}/>
                    </View>
                </View>

                {game.length !== 0
                    ?
                    <FlatList
                    // key = {game.key.toString()}
                    contentContainerStyle= {{justifyContent:"space-between"}}
                    keyExtractor={(item) => item.key.toString()}
                    data = {game}
                    renderItem= {({item}) => <GameItem updateGames ={allGames} title={item.value} gameId={item.key} user={currentUser}/>}
                >

                    </FlatList>
                    :
                    <TouchableOpacity onPress={allGames} style = {{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <MaterialCommunityIcons name="refresh" size={250} style={{color:"black"}}/>
                        <Text style={{color:"black", fontSize:15}}>Please refresh to load games!</Text>

                    </TouchableOpacity>

                }




            </Background>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection:"column"
    },
    searchBar:{
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        borderWidth:1,
        borderRadius:4,
        width:"98%",
        marginTop:36,
        marginBottom:10,
        borderColor:"black",
        backgroundColor:"transparent"
    },
    searchInput:{
        width:"85%",
        height:45,
        fontSize:20,

    },
    searchSpace:{
        justifyContent:"center",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"rgba(177,177,177,0.78)"
    }

})

export default GameScreen;
