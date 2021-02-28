import React from 'react';

import{createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './LoginScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

const RootStack = createStackNavigator();

export default function RootStacksCreen ({navigation}){
    return(
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name='LoginScreen' component={LoginScreen} />
        {/* <RootStack.Screen name='SignInScreen' component={SignInScreen} />
        <RootStack.Screen name='SignUpScreen' component={SignUpScreen} /> */}
    </RootStack.Navigator>
    )
}