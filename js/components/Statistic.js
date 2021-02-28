import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {MaterialIcons} from '@expo/vector-icons';
import CustomMultiPicker from "react-native-multiple-select-list";
import { ProgressBar, Colors } from 'react-native-paper';



 export default function Statistic({ navigation }) {

    const [statisticLoaded, setStatisticLoaded] = useState(false)
    const [questionData, setQuestionData] = useState([])
    const [userData, setUserData] = useState([])
    const [branchData, setBranchData] = useState([])
    const [filterdBranchname, setFilteredBranchname] = useState([])
    const [rendered, setRendered] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [categoryNames, setCategoryNames] = useState([])

    useEffect(()=>{
        if(statisticLoaded === false){
            axios.get('http://localhost:5000/getUserData')
            .then((responseUserData)=>{
                setUserData(responseUserData)

                axios.get('http://localhost:5000/getCategoryData')
                .then((responseCategoryData) =>{
                    let catName = []
                    for (let index = 0; index < responseCategoryData.data.length; index++) {
                        catName.push(responseCategoryData.data[index].categoryName)
                        
                    }


                    axios.get('http://localhost:5000/getBranchData')
                    .then((responseBranchData)=>{
                            let nameOfBranch = [] 
                            for (let index = 0; index < responseBranchData.data.length; index++) {
                                nameOfBranch.push(responseBranchData.data[index].branchname)  
                            }
                                axios.get('http://localhost:5000/getQuestionsData')
                                .then((responseQuestionData) =>{                     
                                    
                                    let questionsMustbeFiltered = []

                                    for (let index = 0; index < responseQuestionData.data.length; index++) {
                                        questionsMustbeFiltered.push([responseQuestionData.data[index].question, responseQuestionData.data[index].counterWrongAnswers] )  
                                    }

                                    setFilteredBranchname(nameOfBranch)    
                                    setQuestionData(responseQuestionData)
                                    setBranchData(responseBranchData)
                                    setStatisticLoaded(true)
                                    setRendered(true)
                                    setCategoryData(responseCategoryData)
                                    setCategoryNames(catName)
                                    
                                })
                    })
                }) 
            })     
        }

    }, [statisticLoaded])

    function randomIntFromInterval(min, max) { // min and max included 
       let a = Math.floor(Math.random() * (max - min + 1) + min)
       let b = a /100
        return b;
      }

    const renderStatistikDataLocation = () =>{
        if(statisticLoaded === true){
            return filterdBranchname.map((obj, index)=>{
                let fakeNumber = randomIntFromInterval(0,100)
                let prozentNumber = (fakeNumber * 100).toFixed(0)
                
                //erstellt die Tabelle aller Filialen
                return <View key={index} style={{flexDirection:'row', justifyContent:'center', marginTop:10}}>
                            <View style={{width:200}}>
                                <Text style={{fontSize:14}}>{obj}</Text>
                                    <View>
                                        <ProgressBar progress={fakeNumber} color={Colors.red800} />
                                        <Text>{prozentNumber} %</Text>
                                    </View>
                             </View>
                       </View>
            })   
        }    
    }


    const renderCategoryData = () => {       
        if(statisticLoaded === true){
            return categoryNames.map((obj, index)=>{

                let fakeNumber = randomIntFromInterval(0,100)
                let prozentNumber = (fakeNumber * 100).toFixed(0)
                
                //erstellt die Tabelle aller Filialen
                return <View key={index} style={{flexDirection:'row', justifyContent:'center', marginTop:10}}>
                            <View style={{width:200}}>
                                <Text style={{fontSize:14}}>{obj}</Text>
                                    <View>
                                        <ProgressBar progress={fakeNumber} color={Colors.red800} />
                                        <Text>{prozentNumber} %</Text>
                                    </View>
                             </View>
                       </View>
            })   
        
        }
    }



    const sortWrongAnswers = (a,b) => {
        if ( a.counterWrongAnswers < b.counterWrongAnswers ){
            return -1;
          }
          if ( a.counterWrongAnswers> b.counterWrongAnswers ){
            return 1;
          }
          return 0;
        }
    
    let valueWithSortWrongAnswers = [];
    if(rendered === true){
        valueWithSortWrongAnswers = questionData.data.sort(sortWrongAnswers).reverse().slice(0,3)

    }
    

    const renderWrongAnswers = () => {
        if(statisticLoaded === true){
            return valueWithSortWrongAnswers.map((obj, index) =>{
                    //erstellt die Tabelle Top 3 falsch beantworteter Fragens
                    return <View key={index} style={{flexDirection:'row', justifyContent:'center', marginTop:10}}>
                                    <Text style={{width:350, color:"black"}}>{obj.question}</Text>
                                    <Text style={{width:40, color:"red"}}>{obj.counterWrongAnswers}</Text>
                                    
                            </View>
            })
                
        }
    }


    if(rendered === false){
        return(
            <View>
                <Text>...loading</Text>
            </View>
        )
    }

    if(rendered === true){
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View>
                    <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Faktor - unbeantwortete Fragen nach Standort</Text>
                    <Text style={{fontSize:16, fontWeight:'bold', color:"#ffb802"}}>unbeantwortete Fragen / Anzahl der User</Text>
                </View>
                <View>{renderStatistikDataLocation()}</View>

                <View style={{marginTop:25}}>
                    <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Faktor - unbeantwortete Fragen nach Kategorie</Text>
                    <Text style={{fontSize:16, fontWeight:'bold', color:"#ffb802"}}>unbeantwortete Fragen / Anzahl der User</Text>
                </View>
                <View>{renderCategoryData()}</View>
    
                <View style={{marginTop:25}}> 
                    <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Top 3 der falsch beantworteten Fragen</Text>
                </View>
                <View>{renderWrongAnswers()}</View>
    
            </View>
        )
    }



}

const styles = StyleSheet.create({
    username: {
        paddingBottom: 20,
        alignItems: 'stretch'
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#ffb802",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderColor: "black",
        borderWidth: 1,
        marginLeft:10
    },
    appButtonText: {
        fontSize: 18,
        color: "black",
        alignSelf: "center"
    }

})