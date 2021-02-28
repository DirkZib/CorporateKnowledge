import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {MaterialIcons} from '@expo/vector-icons';
import CustomMultiPicker from "react-native-multiple-select-list";


let questions = {
    question: null,
    answer1: null,
    answer2: null,
    answer3: null,
    isTrue1: false,
    isTrue2: false,
    isTrue3: false,
    category: null,
    counterWrongAnswers: 0
}

 export default function QuestionsManagement({ navigation }) {

    const [questionData, setQuestionData] = useState([])
    const [filteredQuestions, setFilteredQuestions] = useState([])
    const [userData, setUserData] = useState(false)
    const [categoryIds,setCategoryIds] = useState({});
    const [categoryData,setCategoryData] = useState([]);
    const [categoryDataPost, setCategoryDataPost] = useState([])
    const [categoryLoaded, setCategoryLoaded] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState([])
    const [loading,setLoading] = useState(true);
    
    //erstellt die Frage in der Datenbank
    const postQuestion = () =>{
        let headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        let categories = [];
        selectedCategory.forEach(category => {
            categories.push({category: categoryIds[category]});
        });
        axios.post(`http://localhost:5000/createNewQuestion`, { 
            question: questions.question, 
            answer1: questions.answer1,
            isTrue1: questions.isTrue1,
            answer2: questions.answer2,
            isTrue2: questions.isTrue2,
            answer3: questions.answer3,
            isTrue4: questions.isTrue3,
            category: categories,
            counterWrongAnswers: questions.counterWrongAnswers
            }, { headers })
            .then(res => {
            })                
    }

    useEffect(() => {
        if(userData === false){     
            //User Daten
            axios.get('http://localhost:5000/getUserData')
            .then((responseUserData)=>{
                //User muss später geändert werden
                setUserData(responseUserData.data[0]);
                axios.get('http://localhost:5000/getQuestionsData')
                .then((responseQuestions) =>{                                   
                  let questionsMustbeFiltered = []
                  //filtert alle Fragen heraus
                  for (let index = 0; index < responseQuestions.data.length; index++) {
                      
                      questionsMustbeFiltered.push(responseQuestions.data[index].question)
                      console.log(questionsMustbeFiltered)
                  }
                  setQuestionData(responseQuestions)   
                
                // Kategorie Daten
                axios.get('http://localhost:5000/getCategoryData')
                .then((responseCategoryData) =>{

                        //Array für Kategorie Namen
                        let categoryName = []
                        let categoryIds = {};
                        // Array für zusammengefasste Kategorie Daten
                        let dataForPushCategory = []
                        //nimmt den Mandantenname vom aktuellen User
                        const currentMandant = responseUserData.data[0].mandant
                        //filter alle Fragen die für diesen Mandanten zugehörig sind
                        
                        // filtert alle Kategorien die für diesen Mandanten zugehörig sind
                        const resultObj = responseCategoryData.data.filter(val => currentMandant.includes(val.mandant))
                        //sucht die categoryName + categoryId im Bezug auf Mandanten raus
                        for (let index = 0; index < resultObj.length; index++) {
                            const name = resultObj[index].categoryName;
                            const categoryId = resultObj[index]._id

                            //Kategoriename
                            categoryName.push(name);
                            //KategorieIds
                            categoryIds[name] = categoryId;
                            // Befüllt das Array mit der Kategorie ID und den Namen für die POST-Funktion
                            dataForPushCategory.push({category: categoryId, name});

                        }
                        // für die Daten in useState's zum weiterverarbeiten
                        if(categoryLoaded===0){
                            setCategoryData(categoryName)
                            setCategoryIds(categoryIds);
                            setCategoryDataPost(dataForPushCategory)
                            setFilteredQuestions(questionsMustbeFiltered)
                            setCategoryLoaded(1)
                        }



                })     
              })
            })
            setLoading(false);
        }
    
    }, [userData])

    // states für die Buttons
    const [button1, setButton1] = useState("falsche Antwort")
    const [button2, setButton2] = useState("falsche Antwort")
    const [button3, setButton3] = useState("falsche Antwort")
    const[buttonColor1, setButtonColor1] = useState(styles.appButtonFalse)
    const[buttonColor2, setButtonColor2] = useState(styles.appButtonFalse)
    const[buttonColor3, setButtonColor3] = useState(styles.appButtonFalse)
    //Switch für die Buttons ...Name + Aussehen
    const changeButtonColorText1 = () =>{
        if(button1 === "falsche Antwort"){       
            setButton1("richtige Antwort")
            questions.isTrue1 = true
            setButtonColor1(styles.appButtonTrue)
            
        }
        if(button1 === "richtige Antwort"){
            setButton1("falsche Antwort")
            questions.isTrue1 = false
            setButtonColor1(styles.appButtonFalse) 
        }
    }
    const changeButtonColorText2 = () =>{
        if(button2 === "falsche Antwort"){       
            setButton2("richtige Antwort")
            questions.isTrue2 = true
            setButtonColor2(styles.appButtonTrue)
        }
        if(button2 === "richtige Antwort"){
            setButton2("falsche Antwort")
            questions.isTrue2 = false
            setButtonColor2(styles.appButtonFalse)
        }
    }
    const changeButtonColorText3 = () =>{
        if(button3 === "falsche Antwort"){       
            setButton3("richtige Antwort")
            questions.isTrue3 = true
            setButtonColor3(styles.appButtonTrue)
        }
        if(button3 === "richtige Antwort"){
            setButton3("falsche Antwort")
            questions.isTrue3 = false
            setButtonColor3(styles.appButtonFalse)
        }
    }

    
    const questionOverview = () =>{
        if(categoryLoaded === 1){       
            console.log("Questions: " + filteredQuestions) 
            return filteredQuestions.map((obj, index)=>{
                //erstellt die Tabelle aller Fragen
                return <View key={index} style={{flexDirection:'row', justifyContent:'center', marginTop:10}}>
                         
                                {/* Frage */}
                                <Text style={{width:250}}>{obj}</Text>
                                {/* Zahl falscher Antworten */}
                                <Text style={{width:150, color:"red"}}>{questionData.data[index].counterWrongAnswers}</Text>
                                {/* Button Frage reaktivieren */}
                                <TouchableOpacity style={styles.appButtonContainer} >
                                        <Text style={styles.appButtonText}>reaktivieren</Text>
                                </TouchableOpacity>
                                {/* Button Frage löschen */}
                                <TouchableOpacity style={styles.appButtonContainer} >
                                        <Text style={styles.appButtonText}>löschen</Text>
                                </TouchableOpacity>       
                       </View>
            })
        }
    }

        return(
            <ScrollView>
 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', headerTitleAlign: "center" }}>
                <View>
                <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Frage erstellen</Text>
                </View>
                <View style={{width:300, height:100, justifyContent:'center', alignContent:'center'}}>                
                <TextInput
                        style={styles.username}
                        placeholder='Frage'
                        multiline={true}
                        onChangeText={text => { questions = { ...questions, question: text } }}
                /></View>
                <View style={{flexDirection:'row', justifyContent:'center', marginTop:20}}>
                    <TextInput
                            style={styles.username}
                            multiline={true}
                            placeholder='Antwort 1 ...'
                            onChangeText={text => { questions = { ...questions, answer1: text } }}
                    />
                    <TouchableOpacity style={buttonColor1}>
                            <Text onClick={changeButtonColorText1} style={styles.appButtonText}>{button1}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row', justifyContent:'center', marginTop:20}}>
                    <TextInput
                            style={styles.username}
                            multiline={true}
                            placeholder='Antwort 2 ...'
                            onChangeText={text => { questions = { ...questions, answer2: text } }}
                    />
                    <TouchableOpacity style={buttonColor2}>
                            <Text onClick={changeButtonColorText2}  style={styles.appButtonText}>{button2}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row', justifyContent:'center', marginTop:20}}>
                    <TextInput
                            style={styles.username}
                            multiline={true}
                            placeholder='Antwort 3 ...'
                            onChangeText={text => { questions = { ...questions, answer3: text } }}
                    />

                    <TouchableOpacity style={buttonColor3}>
                            <Text onClick={changeButtonColorText3}  style={styles.appButtonText}>{button3}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width:200}}>
                        <CustomMultiPicker
                        options={categoryData}
                        search={false} // should show search bar?
                        multiple={true} //
                        placeholder={"Search"}
                        placeholderTextColor={'#757575'}
                        returnValue={"label"} // label or value
                        callback={(res)=>{ setSelectedCategory(res) }} // callback, array of selected items
                        rowBackgroundColor={"#eee"}
                        rowHeight={40}
                        rowRadius={5}
                        iconColor={"#ffb802"}
                        iconSize={30}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        scrollViewHeight={categoryData.length*50}
                        //onSelectedItemsChange={(name)=>{ setSelectedCategory(res) }}
                        selected={[]} // list of options which are selected by default
                        />
                </View>
                <View style={{marginTop:20}}>
                <TouchableOpacity style={styles.appButtonContainer}>
                            <Text onClick={postQuestion}  style={styles.appButtonText}>Frage erstellen</Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop:50,alignItems: 'center'}}>
                    <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Fragenübersicht</Text>
                    <View style={{flexDirection:'row', justifyContent:'flex-start', marginTop:10, width:633}}>
                        <Text style={{width:250,fontWeight:'bold'}}>Fragen</Text>
                        <Text style={{width:150,fontWeight:'bold'}}>Falsche Antworten</Text>
                    </View> 
                    <View>{questionOverview()}</View>
                </View>

            </View>       
            </ScrollView>
             
        )
}

//"#ffb802"
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
       // color: "white",
        alignSelf: "center"

    },
    appButtonTrue: {
        elevation: 8,
        backgroundColor: "#ffb802",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderColor: "black",
        borderWidth: 1,
        fontSize: 18,
        color: "#fff",
        alignSelf: "center"
    },
    appButtonFalse: {
        elevation: 8,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderColor: "black",
        borderWidth: 1,
        fontSize: 18,
        color: "#ffb802",
        alignSelf: "center"
    }

})