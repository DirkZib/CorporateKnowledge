import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Button,ActivityIndicator, TouchableOpacity, Text  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator} from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons'


import QuestionsScreen from './js/components/Questions'
import HomeScreen from './js/components/Home'
import UserManagementScreen from './js/components/UserManagement'
import QuestionsManagementScreen from './js/components/QuestionsManagement'
import StatisticScreen from './js/components/Statistic'
import NotificationsScreen from './js/components/Notification'
import {AuthContext, AutoContext} from './js/components/context'
import {DrawerContent} from './js/components/DrawerContent'
import RootStackScreen from './js/components/RootScreen'
import AsyncStorage from '@react-native-community/async-storage';


const HomeStack = createStackNavigator();
const QuestionsStack = createStackNavigator();
const UserManagementStack = createStackNavigator();
const QuestionsManagementStack = createStackNavigator()
const StatisticStack = createStackNavigator()
const NotificationsStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = ({navigation}) =>(
<HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'Home',
      headerStyle:{
        backgroundColor:"#ffb802",
      },
      //headerTintColor: '#404040',
      // headerTitleStyle:{
      //   textAlign:'center',
      //   fontWeight: 'bold',
      //   paddingHorizontal: 10

      // },
     
      headerLeft:()=>(
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.appButtonContainer}>
        <Icon name="menu" size={30}></Icon>
        </TouchableOpacity>  
      )
    }}/>
  </HomeStack.Navigator>
)
const QuestionsStackScreen = ({navigation}) =>(
  <QuestionsStack.Navigator>
      <QuestionsStack.Screen name="Questions" component={QuestionsScreen} options={{
            title: 'Fragen',
            headerStyle:{
              backgroundColor:"#ffb802",
            },
         //   headerTintColor: '#404040',
      headerLeft:()=>(
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.appButtonContainer}>
        <Icon name="menu" size={30}></Icon>
        </TouchableOpacity>  
      )
    }}/> 
    </QuestionsStack.Navigator>
  )

  const UserManagementStackScreen = ({navigation}) =>(
    <UserManagementStack.Navigator>
        <UserManagementStack.Screen name="UserManagement" component={UserManagementScreen} options={{
              title: 'Benutzermanagement',
              headerStyle:{
                backgroundColor:"#ffb802",
              },
           //   headerTintColor: '#404040',
              headerLeft:()=>(
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.appButtonContainer}>
                  <Icon name="menu" size={30}></Icon>
          </TouchableOpacity>  
        )
      }}/> 
      </UserManagementStack.Navigator>
    )

    const QuestionsManagementStackScreen = ({navigation}) =>(
      <QuestionsManagementStack.Navigator>
          <QuestionsManagementStack.Screen name="QuestionsManagement" component={QuestionsManagementScreen} options={{
                title: 'Fragenmanagement',
                headerStyle:{
                  backgroundColor:"#ffb802",
                },
             //   headerTintColor: '#404040',
                headerLeft:()=>(
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.appButtonContainer}>
                    <Icon name="menu" size={30}></Icon>
            </TouchableOpacity>  
          )
        }}/> 
        </QuestionsManagementStack.Navigator>
      )

      const StatisticStackScreen = ({navigation}) =>(
        <StatisticStack.Navigator>
            <StatisticStack.Screen name="Statistic" component={StatisticScreen} options={{
                  title: 'Statistik',
                  headerStyle:{
                    backgroundColor:"#ffb802",
                  },
               //   headerTintColor: '#404040',
                  headerLeft:()=>(
              <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.appButtonContainer}>
                      <Icon name="menu" size={30}></Icon>
              </TouchableOpacity>  
            )
          }}/> 
          </StatisticStack.Navigator>
        )

export default function App() {

  const [isLoading, setIsLoading] = React.useState(true)
  const [userToken, setUserToken] = React.useState(null)
useEffect(() => {
  setTimeout(()=> {
    setIsLoading(false)
  },1000)
},[])

const authContext = React.useMemo(() =>({
signIn: () => {
  setUserToken('TESTA')
  setIsLoading(false)
},
signOut: () => {
  setUserToken(null)
  setIsLoading(false)
},
signUp: () => {
  setUserToken('TESTA')
  setIsLoading(false)
},

}))

if(isLoading){
  return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <ActivityIndicator size="large"/>
    </View>
  )
}

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken !== null ? (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                  <Drawer.Screen name="Home" component={HomeStackScreen} />
                  <Drawer.Screen name="Questions" component={QuestionsStackScreen} />
                  <Drawer.Screen name="UserManagement" component={UserManagementStackScreen} />
                  <Drawer.Screen name="QuestionsManagement" component={QuestionsManagementStackScreen} />
                  <Drawer.Screen name="Statistic" component={StatisticStackScreen} />
          </Drawer.Navigator>
        ):
        <RootStackScreen/> 
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appButtonContainer: {
    backgroundColor: "#ffb802",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 16,
    color: "black",
    alignSelf: "center"
  }
});
