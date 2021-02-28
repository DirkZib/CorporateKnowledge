import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomMultiPicker from "react-native-multiple-select-list";

export default function Answers(props) {
  const {abc, answer1,answer2,answer3,selected,setSelected} = props
  const answers = [answer1,answer2,answer3]
    return (
        <View>
                <Text>{abc}</Text>

                <View style={{width:200}}>
                    <CustomMultiPicker
                        options={answers}
                        search={false} // should show search bar?
                        multiple={true} //
                        placeholder={"Search"}
                        placeholderTextColor={'#757575'}
                        returnValue={"label"} // label or value
                        callback={(res)=>{ setSelected(res) }} // callback, selected item
                        rowBackgroundColor={"#eee"}
                        rowHeight={40}
                        rowRadius={5}
                        iconColor={"#ffb802"}
                        iconSize={30}
                        selectedIconName={"ios-checkmark-circle-outline"}
                        unselectedIconName={"ios-radio-button-off-outline"}
                        //scrollViewHeight={130}
                        selected={selected} // list of options which are selected by default
                    />
                </View>
        </View>
      );
}