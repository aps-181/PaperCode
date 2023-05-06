import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectOutput } from '../slices/langSlices'


const ConsoleScreen = () => {

    const result = useSelector(selectOutput)
    let output = "No output to be displayed"
    if (result != null) {
        if (result.statusCode == 200) {
            output = result.output
        } else {
            output = result.error
        }
    }
    return (
        <SafeAreaView>
            <Text>Output:{'\n'}</Text>
            <Text>{output}</Text>
        </SafeAreaView>
    )
}

export default ConsoleScreen

const styles = StyleSheet.create({})