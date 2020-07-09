import React, {useEffect, useState} from 'react';

import {View, Image, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, ImageBackground} from 'react-native';
import firebase from 'firebase';
import {useNavigation} from "@react-navigation/native";
import {Select, SelectItem,} from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'

import Background from "../views/Background";
import SearchButtons from "../Components/SearchButtons";
import GameItem from "../Components/GameItem";
import GameScreenItem from "../Components/GameScreenItem";

import firebaseDb from "../firebaseDb";
import AntDesign from "react-native-vector-icons/AntDesign";




const GameScreen = (props) => {
    const navigation = useNavigation()
    const user = props.route.params.user

    // ARRAY FOR PICKER IN THE SEARCH BAR ==============================================================================
    const sports = ["Soccer", "BasketBall", "Floorball", "Badminton", "Tennis", "Others"];
    const [sportsIndex, setSportsIndex] = useState();
    const [sportValue, setSportValue] = useState();

    // IMAGE FOR RELATIVE SPORT =======================================================================================
    const sportImage = (sport) => {
        if(sport === "Soccer"){
            return require("../assets/soccer_coloured.png");
        } else if(sport === "BasketBall"){
            return require("../assets/basketball_coloured.png");
        } else if(sport === "Floorball"){
            return require("../assets/floorball_icon.png");
        } else if(sport === "Badminton"){
            return require("../assets/badminton_icon.png");
        } else if(sport === "Tennis"){
            return require("../assets/tennis_coloured.png");
        } else {
            return require("../assets/other_games.png")
        }
    }

    // COLOUR SCHEME====================================================================================================
    const changeColour = {

    }



    // SEARCH BAR FUNCTION =============================================================================================
    const searchSport = (sport) => {
        console.log(sportValue)
        let searched = [];
        const now = new Date().getTime();
        gamesRef.where('sport', '==', sport)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const d = doc.data();
                    if(d.date.toMillis() < now){
                        doc.ref.delete().then(()=>{});
                    } else if(d.hostId === currentUser){}
                    else if(parseInt(d.availability) <= 0){}
                    else {
                        searched.push({key:doc.id, value:doc.data()});
                    }
                })
                setGame(searched);
            })
    }


    // MODAL FUNCTION ==============================================================================================
    const [game, setGame] = useState ([]);

    //UID OF USER ================================================================================================
    const currentUser = props.route.params.user.id;

    //UPDATING AND QUERYING OF GAME DETAILS ================================================================================================

    const gamesRef = firebaseDb.firestore().collection('game_details');
    const allGames = () => {
        gamesRef
            .orderBy("date", "asc")
            .limit(15)
            .onSnapshot(snapshot => {
                    const someGame = [];
                    const now = new Date().getTime();
                    let num = 1;
                    snapshot.forEach( doc => {
                            const d = doc.data();
                            console.log("num reloads :" + num);
                            num = num + 1;
                            if(d.date.toMillis() < now){
                                doc.ref.delete().then(()=>{});
                            } else if(d.hostId === currentUser){}
                            else if( parseInt(d.availability) <= 0){}
                            else {
                                someGame.push({key:doc.id, value:doc.data()});
                            }
                        }
                    )
                    setGame(someGame);
                },
                error => {
                    console.log("Game Screen " + error.message)
                })
    }

    useEffect(() => {
        const unsubscribe = allGames();

        return () => unsubscribe;

    }, [])


    return (<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
            {/*<ImageBackground source={require("../assets/SkylineBackGround.png")} style={{height:"100%", width:"100%"}}>*/}
            <Background style = {styles.container}>

                {/*==================================== Title and hosting a gmae ======================================*/}
                <View style = {{justifyContent: 'space-between',height: 50, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 5}}>
                    <Text style = {styles.text}> Games </Text>
                    <View style = {{backgroundColor: 'transparent', borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginLeft: 20, top: 5}}>
                        <Text style = {{...styles.text, bottom: 2}}>  Host </Text>
                    <TouchableOpacity style = {{backgroundColor: 'rgba(255,255,255,0.30)', borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center', width: 40}}
                                      activeOpacity={ 0.9}
                                      onPress={() => {
                                          navigation.navigate('HostGameScreen',
                                              {
                                                  uid: currentUser,
                                              }
                                          )
                                      }}
                    >
                        <Entypo name="plus" color={'white'} size={40}/>
                    </TouchableOpacity>
                </View>
                </View>

                <View style={styles.searchSpace}>
                    <View style={styles.searchBar}>
                        <Select
                            style = {{width: "90%", justifyContent:"space-between"}}
                            placeholder='Select Sport'
                            value ={sports[sportsIndex - 1]}
                            onSelect={index => {
                                setSportsIndex(index)
                                setSportValue(sports[index.row])
                            }}
                            selectedIndex={sportsIndex}>
                            {sports.map(sport => (
                                <SelectItem key={sport} title={sport}/>
                            ))}

                        </Select>
                        <SearchButtons style={{flex: 1, elevation: 5}} searchMe={searchSport}/>
                    </View>
                </View>
                {/*<TouchableOpacity style = {{backgroundColor: 'rgba(255,255,255,0.84)', borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginLeft: 20, top: 5}}*/}
                {/*                  activeOpacity={ 0.9}*/}
                {/*                  onPress={() => {*/}
                {/*                      navigation.navigate('HostGameScreen',*/}
                {/*                          {*/}
                {/*                              uid: currentUser,*/}
                {/*                          }*/}
                {/*                      )*/}
                {/*                  }}*/}
                {/*>*/}
                {/*    <Text style = {{...styles.text, color: '#1c1c1c', bottom: 2}}>  Host </Text>*/}
                {/*    <FontAwesome name="plus" color={'#1c1c1c'} size={20}/>*/}
                {/*    <Text >   </Text>*/}
                {/*</TouchableOpacity>*/}
                <FlatList showsHorizontalScrollIndicator={false}
                          horizontal={true}
                          contentContainerStyle= {{justifyContent:"space-between"}}
                          keyExtractor={(item) => item.toString()}
                          data = {sports}
                          renderItem= {({item}) =>
                              item === sportValue
                              ?
                              <View style={styles.sportItem}>
                                  <TouchableOpacity activeOpacity={0.6}
                                                    style={{...styles.sportSelected}}
                                                    onPress ={ () => {
                                                        setSportValue(item);
                                                        searchSport(item);


                                                    }}
                                  >
                                      <View style={styles.sportImageSelected}>
                                          <Image source={sportImage(item)} style={{width:35, height:35, resizeMode:"contain", opacity:1.0}}/>
                                      </View>

                                  </TouchableOpacity>
                                  <Text>{item}</Text>
                              </View>
                              : <View style={styles.sportItem}>
                                      <TouchableOpacity activeOpacity={0.6}
                                                        style={{...styles.sportSelection}}
                                                        onPress ={ () => {
                                                            setSportValue(item);
                                                            searchSport(item);


                                                        }}
                                      >
                                          <View style={styles.sportImageShadow}>
                                              <Image source={sportImage(item)} style={{width:35, height:35, resizeMode:"contain", opacity:0.3}}/>
                                          </View>

                                      </TouchableOpacity>
                                      <Text style={{opacity:0.3}}>{item}</Text>
                                  </View>

                          }

                >



                </FlatList>

                {game.length !== 0
                    ?

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        contentContainerStyle= {{justifyContent:"center", alignItems:"center"}}
                        keyExtractor={(item) => item.key.toString()}
                        data = {game}
                        renderItem= {({item}) => <GameScreenItem  gameDetails={item.value}
                                                            gameId={item.key}
                                                            user={user}
                                                            itemType={"Join"}
                        />}
                    >

                    </FlatList>
                    :
                    <TouchableOpacity style = {{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <Text style={{color:"black", fontSize:15}}>There are currently no games!</Text>

                    </TouchableOpacity>

                }

            </Background>
            {/*</ImageBackground>*/}
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
        justifyContent:"space-around",
        alignItems:"center",
        borderWidth:1,
        borderRadius:4,
        width:"98%",
        marginTop:30,
        marginBottom:10,
        borderColor:"black",
        backgroundColor:"transparent"
    },
    searchInput:{
        width:"85%",
        height:45,
        fontSize:20,
        left: 10
    },
    searchSpace:{
        justifyContent:"center",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"rgba(177,177,177,0.78)"
    },
    sportSelection:{
        backgroundColor:'rgb(255,255,255)',
        elevation:10,
        borderRadius:15,
        height:70,
        width:100,
        justifyContent:"center",
        alignItems:"center"

    },
    sportSelected:{
        backgroundColor:'rgb(239,195,144)',
        elevation:5,
        borderRadius:15,
        height:70,
        width:100,
        justifyContent:"center",
        alignItems:"center"
    },
    sportItem:{
        height:90,
        width:100,
        marginTop:10,
        marginHorizontal:10,
        justifyContent:"center",
        alignItems:"center",

    },
    sportImageShadow:{
        width: 50,
        height: 50 ,
        borderRadius:27.5,
        backgroundColor:"transparent",
        alignItems:"center",
        paddingTop:7.5
    },
    sportImageSelected: {
        width: 50,
        height: 50,
        borderRadius: 27.5,
        // borderWidth: 1,
        // borderColor: "rgba(46,44,47,0.83)",
        backgroundColor: "transparent",
        alignItems: "center",
        paddingTop: 7
    },
    text: {
        color: 'white',
        justifyContent: 'center',
        fontSize: 27,
        fontWeight: "bold",
    },
})

export default GameScreen;
