import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IDEScreen from './Screens/IDEScreen';
import ConsoleScreen from './Screens/ConsoleScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


// const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();


const IDEHome = ({ route, navigation }) => {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false
        }}>
            <Tab.Screen name="IDEScreen" component={IDEScreen} />

            <Tab.Screen name="Console" component={ConsoleScreen} />
        </Tab.Navigator>
    );
}

export default IDEHome

const styles = StyleSheet.create({})