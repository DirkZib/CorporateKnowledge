import React, {useState} from 'react';
import { StyleSheet,Text, View, TextInput, TouchableOpacity} from 'react-native';
import FontAwsome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import {AuthContext} from './context'
import axios from 'axios';
//import { TouchableOpacity } from 'react-native-gesture-handler';


export default function LoginScreen(navigation) {



            // get UserData from DB
        const getCategory = () => {
            axios.get('http://localhost:5000/getUserData')
            .then((response) =>{
                const data = response.data
                setUserData(data)
            })
        }
        const [counterGetData, setCounterGetDatat] = useState('start')
        const  useGetCategory = () =>{
            if(counterGetData === 'start'){
                getCategory()
                setCounterGetDatat('ende')
            }
        }
        useGetCategory()
        const [userData, setUserData] = useState(1)
        const validateLogin = ( id, mail, password) => {
            if(mail === userData.mail && password === userData.password && id === userData._id ){
                //go to next Site
            }else{
                //still on this site an show error
            }
        }

//------------------------------------------------------------------------------------------
        const [data, setData] = React.useState({
            email: '',
            password: '',
            check_textInputChange: false,
            secureTextEntry: true
        })

        const {signIn} = React.useContext(AuthContext)

        const handlePasswordChange = (val) => {
            if( val.trim().length >= 8 ) {
                setData({
                    ...data,
                    password: val,
                    isValidPassword: true
                });
            } else {
                setData({
                    ...data,
                    password: val,
                    isValidPassword: false
                });
            }
        }

        const updateSecureTextEntry = () =>{
            if(data.secureTextEntry = true){
                setData({
                    password: false
                })
            }else{
                setData({
                    password: true
                })
            }
        }
 
    return (
        <View style={styles.container}>
            <View style={styles.header}> 
                <Text>Willkommen</Text>
            </View>

            <View style={styles.footer}>
                <Text>E-Mail</Text>
                <View>
                    <FontAwsome 
                        name='user-o'
                        color='#6B6B6B'
                        size={20}
                     />
                    <TextInput 
                        placeholder='E-Mail Adresse'
                        autoCapitalize='none'
                    />
                </View>

                <Text style={[{marginTop:30}]}>Passwort</Text>
                <View>
                    <FontAwsome 
                        name='lock'
                        color='#6B6B6B'
                        size={20}
                     />
                    <TextInput 
                        placeholder='Passwort'
                        secureTextEntry={data.secureTextEntry? true: false}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ? 
                        <Feather 
                            name="eye-off"
                            color="grey"
                            size={20}
                        />
                        :
                        <Feather 
                            name="eye"
                            color="grey"
                            size={20}
                        />
                        }
                    </TouchableOpacity>
                   
                    <View>
                    <TouchableOpacity onPress={() => {signIn()}} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>Login</Text>
                    </TouchableOpacity>       

                                {/* <Button
          onPress={() => {signIn()}}
          title="Login"
        /> */}
                    </View>
                    
                </View>
            </View>
            
        </View>

      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#ffb802'
      },
    header:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer:{
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#ffb802",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop:20
      },
      appButtonText: {
        fontSize: 18,
        color: "black",
        alignSelf: "center"
      }
})