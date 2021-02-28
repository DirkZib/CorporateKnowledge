import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Answers from './Answers'
import axios from 'axios';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react';



export default function Questions({navigation}){

      // State der zeigt ob Fragen geladen werden
      const [loading,setLoading] = useState(true);

      // State für userData
      const [userData,setUserData] = useState(false);

      // State questionCounter - zählt wie viele Fragen schon beantwortet wurden. 
      // Startet bei -1 und wird auf 0 gesetzt sobald die Fragen geladen sind. Arrays zählen ab 0, daher ist 0 die erste Frage.
      const [questionCounter,setQuestionCounter] = useState(-1);

      // State für questionData
      const [questionData,setQuestionData] = useState(false);

      // State für Done - alle Fragen beantwortet
      const [done, setDone] = useState(false);

      // State für ausgewählte Frage
      const [selected, setSelected] = useState([]);

      // gibt an, ob der UseEffect komplett verarbeitet wurde
      const [dataLoaded, setDataLoaded] = useState(false)

      // enthält bereits gelöste Fragen
      const [solvedQuestions, setSolvedQuestions] = useState([])

      // Effect Hook zum laden der Daten
      useEffect(() => {
        // Wenn userData==false dann müssen noch Daten geladen werden, sonst mache nichts
        if(userData==false) {
          // Laden wieder anzeigen
          setLoading(true);
          // Daten holen
          // Part 1 - User Daten
          axios.get('http://localhost:5000/getUserData')
          .then((response_user) =>{
              // State setzen
              setUserData(response_user.data[0]);
              // Part 2 - Questions
              axios.get('http://localhost:5000/getQuestionsData')
              .then((response) =>{
                // Temporärer Array zum speichern aller Question-IDs aus dem User Profil
                let user_question_array = []
                let user_solvedQ = []
                 // ForEach alle Fragen aus dem User
                response_user.data[0].questions.forEach(q => {
                  // Wenn noch nicht solved
                  if(q.questionSolved===false) {
                    // dann in das Array pushen
                    user_question_array.push(q.question);
                  }
                  if(q.questionSolved===true){
                    user_solvedQ.push(q.question)
                  }
                });


                // Temporärer Array zum speichern aller Fragen die der User jetzt beantworten soll
                let question_array = [];

                //Fragen die schon beantwortet wurden
                let solvedQ = []

                // ForEach über alle Fragen aus der Datenbank
                response.data.forEach(q=>{
                  // Wenn die Frage im Array der User-Questions ist
                  if(user_question_array.indexOf(q._id)!= -1) {
                    // dann Push ins Array aller Fragen
                    question_array.push(q);
                  }
                  if(user_solvedQ.indexOf(q._id)!= -1){
                    solvedQ.push(q)
                  }
                });
                // State setzen mit Array aller Fragen
                setQuestionData(question_array);
                setSolvedQuestions(solvedQ)
                // Counter um 1 erhöhen um zur ersten Frage zu springen
                setQuestionCounter(questionCounter+1);
                if(dataLoaded===false){
                  setDataLoaded(true)
                }
                
              });
          })
        }
      },[userData]);

      // States für die aktuelle Frage und Antworten
      const [current_question,set_current_question] = useState("");
      const [current_a1,set_current_a1] = useState("");
      const [current_a2,set_current_a2] = useState("");
      const [current_a3,set_current_a3] = useState("");

      // Effect der beim ändern des Question Counter die Frage wechselt
      useEffect(()=>{
        if(questionCounter>-1) {
          // Aktuelle Frage und Antworten setzen
          set_current_question(questionData[questionCounter].question);
          set_current_a1(questionData[questionCounter].answer1);
          set_current_a2(questionData[questionCounter].answer2);
          set_current_a3(questionData[questionCounter].answer3);
          // Laden deaktivierne (falls noch nicht geschehen)
          setLoading(false);
        }
      },[questionCounter])


      // Funktion zum weiter springen
      const nextQuestion = () => {
        // schauen ob frage richtig/falsch
        let currentQuestion = questionData[questionCounter];
        console.log(currentQuestion);
        console.log("nächste frage, grade ausgewählt ist ",selected[0]);
        let isRight = false;
        if(selected[0]==1) { if(currentQuestion.isTrue1) { console.log("richtig"); isRight=true; } else { console.log("falsch") } }
        if(selected[0]==2) { if(currentQuestion.isTrue2) { console.log("richtig"); isRight=true; } else { console.log("falsch") } }
        if(selected[0]==3) { if(currentQuestion.isTrue3) { console.log("richtig"); isRight=true; } else { console.log("falsch") } }

        // aufruf setQuestionSolved
        if(isRight) {
          // Webservice Aufruf mit axios
          axios.post('http://localhost:5000/setQuestionSolved/'+currentQuestion._id)
          .then((res) =>{
            // macht garnix
          });
        }

        // Multiselected zurücksetzen
        setSelected([])
        // Wenn noch fragen offen
        if(questionData.length>questionCounter+1) {
          setQuestionCounter(questionCounter+1)
        } else {
          setDone(true);
        }          
      }

      let colorA1 = styles.falseAnswer
      let colorA2 = styles.falseAnswer
      let colorA3 = styles.falseAnswer
      let colorA4 = styles.falseAnswer
      const changeColorOfAnswers = (index) =>{
         if(solvedQuestions[index].isTrue1 === true)
         colorA1=styles.trueAnswer

         if(solvedQuestions[index].isTrue2 === true)
         colorA2=styles.trueAnswer
  
         if(solvedQuestions[index].isTrue3 === true)
         colorA3=styles.trueAnswer
     
         if(solvedQuestions[index].isTrue4 === true)
         colorA4=styles.trueAnswer
       }
      
      const allSolvedQuestions = () => {
          if(dataLoaded === true){
            console.log("aaa" + JSON.stringify(questionData))
              return solvedQuestions.map((obj, index) =>{
                colorA1 = styles.falseAnswer
                colorA2 = styles.falseAnswer
                colorA3 = styles.falseAnswer
                colorA4 = styles.falseAnswer
                changeColorOfAnswers(index)
          
                return <View key={index} style={{flexDirection:'column' ,justifyContent:'center', marginTop:10}}>
                    <Text style={{fontWeight:'bold'}}>{solvedQuestions[index].question}</Text>
                  <Text style={colorA1}>{solvedQuestions[index].answer1}</Text>
                  <Text style={colorA2}>{solvedQuestions[index].answer2}</Text>
                  <Text style={colorA3}>{solvedQuestions[index].answer3}</Text>
                  <Text style={colorA4}>{solvedQuestions[index].answer4}</Text>
                </View>
              })
          }     
      }

      let headLine = "Nächste Frage"

      if(loading) {
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',headerTitleAlign:"center" }}><p>Lade...</p></View>)
      } else if(done) {
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',headerTitleAlign:"center" }}>
          <Text style={{paddingBottom:50, fontWeight:'bold'}}>Sie haben alle offenen Fragen beantwortet</Text>
          <Text style={{fontWeight:'bold', paddingTop:20, color: "#ffb802"}}>bereits beantwortete Fragen</Text>
          <View>{allSolvedQuestions()}</View>
        </View>
        )
      } else {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',headerTitleAlign:"center" }}>
            <Answers  abc={current_question} answer1={current_a1} answer2={current_a2} answer3={current_a3} selected={selected} setSelected={setSelected} />
            {/* <Button title="Nächste Frage" onPress={setIndex}></Button> */}
            <TouchableOpacity onPress={nextQuestion} style={styles.appButtonContainer} >
                            <Text style={styles.appButtonText}>Nächste Frage</Text>
          </TouchableOpacity>    
          <Text style={{fontWeight:'bold', paddingTop:20, color: "#ffb802"}}>bereits beantwortete Fragen</Text>
          <View>{allSolvedQuestions()}</View>
          </View>
          
        );
    }
}

// Styles definieren

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#ffb802",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop:20
  },
  appButtonText: {
    fontSize: 16,
    color: "black",
    alignSelf: "center"
  },
  falseAnswer: {

    fontSize: 16,
    color: "black",

  },
  trueAnswer: {
    fontSize: 16,
    color: "#ffb802"

}
})

