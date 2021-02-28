import React from 'react'
import {View, StyleSheet, Image} from 'react-native'
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Avatar, Title, Caption, Paragraph, Text,TouchableRipple,Switch, Drawer} from 'react-native-paper'
import {AuthContext} from './context'


export function DrawerContent(props){
const{signOut} = React.useContext(AuthContext)

return(

    <View style={{flex:1}}>
       <DrawerContentScrollView {...props}>
            <View >
                <View style={{height:150, alignItems:'center', justifyContent:'center'}}>
                    <Image 
                    source={require('../../images/logo.png')}
                    style={{height:150, width:'100%', alignItems:'center', justifyContent:'center'}}
                    />
                </View>

                <Drawer.Section style={styles.drawerSection}>
                <DrawerItem 
                
                icon={({color,size}) =>(
                    <Icon
                    name='home-outline'
                    color={color}
                    size={size}
                    />
                )}
                label='Home'
                onPress={()=>{props.navigation.navigate('Home')}}
                />
                <DrawerItem 
                icon={({color,size}) =>(
                    <Icon
                    name='clipboard-list-outline'
                    color={color}
                    size={size}
                    />
                )}
                label='Fragen'
                onPress={()=>{props.navigation.navigate('Questions')}}
                
                />
                <DrawerItem 
                icon={({color,size}) =>(
                    <Icon
                    name='equalizer'
                    color={color}
                    size={size}
                    />
                )}
                label='Statistik'
                onPress={()=>{props.navigation.navigate('Statistic')}}
                />

                <DrawerItem 
                icon={({color,size}) =>(
                    <Icon
                    name='account-settings-outline'
                    color={color}
                    size={size}
                    />
                )}
                label='Benutzermanagement'
                onPress={()=>{props.navigation.navigate('UserManagement')}}
                />
                
                <DrawerItem 
                icon={({color,size}) =>(
                    <Icon
                    name='timeline-help-outline'
                    color={color}
                    size={size}
                    />
                )}
                label='Fragenmanagement'
                onPress={()=>{props.navigation.navigate('QuestionsManagement')}}
                />
                
                </Drawer.Section>
            </View>
       </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem 
            icon={({color,size}) =>(
                <Icon
                name='exit-to-app'
                color={color}
                size={size}
                />
            )}
            label='Logout'
            onPress={()=>{signOut()}}
            />
        </Drawer.Section>

    </View>
)
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
      backgroundColor:'#ffb802'
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        backgroundColor:'#ffb802'
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });