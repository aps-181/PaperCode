import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IDEScreen from './Screens/IDEScreen';
import ConsoleScreen from './Screens/ConsoleScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import tw from 'twrnc'


// const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();


const IDEHome = ({ route, navigation }) => {

    return (
        // <Tab.Navigator screenOptions={{
        //     headerShown: false
        // }}>
        <Tab.Navigator
            activeColor="#1a75ff"
            inactiveColor="#66a3ff"
            barStyle={{ backgroundColor: '#e6f0ff' }}
        >
            <Tab.Screen name="IDEScreen" component={IDEScreen} />

            <Tab.Screen name="Console" component={ConsoleScreen} />
        </Tab.Navigator>
    );
}

export default IDEHome

const styles = StyleSheet.create({})