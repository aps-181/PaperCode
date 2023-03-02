import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import NavOptions from '../Components/NavOptions'
const HomeScreen = () => {
    return (
        <SafeAreaView>
            <View style={tw`mt-2 pl-8 pt-8 mb--3 bg-white h-1/9`}>
                <Text style={tw`text-2xl text-blue-500 font-bold`}>Paper Code</Text>
            </View>
            <View style={tw`bg-blue-400 h-8/9`}>
                <NavOptions />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
})