import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {MaterialIcons} from '@expo/vector-icons';
import CustomMultiPicker from "react-native-multiple-select-list";


let user = { 
    userName: null,
    userMail: null,
    userCategory: null
 };

 export default function UserManagement({ navigation }) {

    const addQuestionToUser = () => {
        // Füge die Frage bei den Usern hinzu, die den selben Mandanten 
        // und die selbe Kategorie wie die neu erstellte Frage haben

    }


    //sendet die Daten an die Datenbank
    const sendNewUser = () => {
        let headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        
console.log("CatID: " + typeof(selectedCategory))
console.log("BraID: " + typeof(selectedBranch))

        let categories = [];
        selectedCategory.forEach(category => {
            categories.push({name: category, category: categoryIds[category]});
        });

        
        let branchesArray = []
        selectedBranch.forEach(branch =>{
            branchesArray.push({branchName: branch, branchId:branchId[branch]})
        })

        axios.post(`http://localhost:5000/createNewUser`, { userName: user.userName, mail: user.userMail, category: categories, branch: branchesArray}, { headers })
            .then(res => {
                // console.log(res);
                 console.log("CreateUSer: " + res.data);
                
            })
            setUserData(false)
            setLoading(true)
       }

    const [userData,setUserData] = useState(false);
    const [categoryData,setCategoryData] = useState([]);
    const [branches, setBranches] = useState([])
    const [categoryIds,setCategoryIds] = useState({});
    const [branchId, setBranchId] = useState({})
    const [mandant, setMandant] = useState()
    const [loading,setLoading] = useState(true);
    const [categoryLoaded, setCategoryLoaded] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedBranch, setSelectedBranch] = useState([])
    const [categoryDataPost, setCategoryDataPost] = useState([])
    const [filteredUsername, setFilteredUsername] = useState([])
    user.category=categoryDataPost

    useEffect(() => {
        if(userData === false){     
            //User Daten
            axios.get('http://localhost:5000/getUserData')
            .then((responseUserData)=>{
                let usernameMustBeFiltered = []

                for (let index = 0; index < responseUserData.data.length; index++) {
                    usernameMustBeFiltered.push(responseUserData.data[index].userName)
                    
                }
                setFilteredUsername(usernameMustBeFiltered)
                //User muss später auf den aktuell eingeloggten USer geändert werden
                setUserData(responseUserData.data[0]);
                // Kategorie Daten

                axios.get('http://localhost:5000/getBranchData')
                .then((responseBranchData)=>{
                   // console.log("BranchData: " + JSON.stringify(responseBranchData))

                    const resultBranchNames = []
                    const branchIds = {}
                    for (let index = 0; index < responseBranchData.data.length; index++) {
                        const IdOfBrach = responseBranchData.data[index]._id
                        const NameOfBranch = responseBranchData.data[index].branchname
                        resultBranchNames.push(responseBranchData.data[index].branchname)
                        
                        //branchIds.push(responseBranchData.data[index]._id)
                        branchIds[NameOfBranch] = IdOfBrach
                    }

                axios.get('http://localhost:5000/getCategoryData')
                .then((responseCategoryData) =>{

                        //Array für Kategorie Namen
                        let categoryName = []
                        let categoryIds = {};
                        // Array für zusammengefasste Kategorie Daten
                        let dataForPushCategory = []
                        //nimmt den Mandantenname vom aktuellen User
                        const currentMandant = responseUserData.data[0].mandant
                        // filtert alle Kategorien die für diesen Mandanten zugehörig sind
                        const resultObj = responseCategoryData.data.filter(val => currentMandant.includes(val.mandant))

                        //sucht die categoryName + categoryId im Bezug auf Mandanten raus
                        for (let index = 0; index < resultObj.length; index++) {
                            const name = resultObj[index].categoryName;
                            const categoryId = resultObj[index]._id

                            categoryName.push(name);
                            categoryIds[name] = categoryId;
                            dataForPushCategory.push({category: categoryId, name});
                        }
                        // für die Daten in useState's zum weiterverarbeiten
                        if(categoryLoaded===0){
                            setMandant(currentMandant)
                            setCategoryData(categoryName)
                            setCategoryIds(categoryIds);
                            setCategoryDataPost(dataForPushCategory)
                            setCategoryLoaded(1)
                            setBranches(resultBranchNames)
                            setBranchId(branchIds)
                            
                        }
                })     
              })
            })
            setLoading(false);
        }
    
    }, [userData])



    const userOverview = () =>{
        if(loading === false){
            //console.log("UserData: " + JSON.stringify(userData))
            
            return filteredUsername.map((obj, index)=>{
                //const key = index
               // console.log("obj: " + obj)
                return <View key={index} style={{flexDirection:'row', justifyContent:'center', marginTop:10}}>
                         
                                <Text style={{width:300,justifyContent:"center", alignItems:"center", paddingVertical: 10, paddingHorizontal: 12,fontSize:18}}>{obj}</Text>
                               
                                <TouchableOpacity style={styles.appButtonContainer} >
                                        <Text style={styles.appButtonText}>bearbeiten</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.appButtonContainer} >
                                        <Text style={styles.appButtonText}>löschen</Text>
                                </TouchableOpacity>
                         
                       </View>

            })
        }
    }

    if(loading === true){
        return(
        <View>
            <Text>loading...</Text>
        </View>
        )
    }

    if(loading === false){
        return(
            <ScrollView>
                <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center', headerTitleAlign: "center", marginBottom:20 }}>
                <View style={{marginTop:50,alignItems: 'center'}}>
                <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Neuen Benutzer anlegen</Text>
                </View>        
                <TextInput
                        style={styles.username}
                        placeholder='Benutzername'
                        onChangeText={text => { user = { ...user, userName: text } }}
                />
                <TextInput
                        style={styles.username}
                        placeholder='Mail'
                        onChangeText={text => { user = { ...user, userMail: text } }}
                />        

                <Text style={{fontSize:14, fontWeight:'bold', color:"#ffb802"}}>Kategorie</Text>
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

                <Text style={{fontSize:14, fontWeight:'bold', color:"#ffb802"}}>Standort</Text>
                <View style={{width:200}}>
                        <CustomMultiPicker
                        options={branches}
                        search={false} // should show search bar?
                        multiple={true} //
                        placeholder={"Search"}
                        placeholderTextColor={'#757575'}
                        returnValue={"label"} // label or value
                        callback={(res)=>{ setSelectedBranch(res) }} // callback, array of selected items
                        rowBackgroundColor={"#eee"}
                        rowHeight={40}
                        rowRadius={5}
                        iconColor={"#ffb802"}
                        iconSize={30}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        scrollViewHeight={branches.length*50}
                        //onSelectedItemsChange={(name)=>{ setSelectedCategory(res) }}
                        selected={[]} // list of options which are selected by default
                        />
                </View>


                <TouchableOpacity style={styles.appButtonContainer}>
                        <Text onClick={sendNewUser} style={styles.appButtonText}>Benutzer hinzufügen</Text>
                </TouchableOpacity>

                <View style={{marginTop:50,alignItems: 'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold', color:"#ffb802"}}>Userübersicht</Text>
                        <View>
                             {userOverview()}
                        </View>
                </View>

                </View>
                
            </ScrollView>
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