import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectOutput } from '../slices/langSlices'


const ConsoleScreen = () => {




    const result = useSelector(selectOutput)
    const [errorHints, setErrorHints] = useState([])
    let output = "No output to be displayed"

    //convert output to individual error strings
    function breakString(inputString) {
        const delimiter = "jdoodle.";
        const result = [];

        let currentString = "";
        let startIndex = 0;
        let delimiterIndex = inputString.indexOf(delimiter);

        while (delimiterIndex !== -1) {
            currentString += inputString.substring(startIndex, delimiterIndex).replace(/\r?\n|\r/g, "");
            result.push(currentString);
            currentString = "";
            startIndex = delimiterIndex + delimiter.length;
            delimiterIndex = inputString.indexOf(delimiter, startIndex);
        }

        currentString += inputString.substring(startIndex).replace(/\r?\n|\r/g, "");
        result.push(currentString);

        return result;
    }


    function filterError(errorString) {                      //retrieving neccesary portion from array
        const errorIndex = errorString.indexOf("error");
        if (errorIndex === -1) {
            return "no error";
        }
        return errorString.slice(errorIndex - 1).trim();
    }


    async function callScrapper(errorFound) {
        await fetch(`https://webscrapping-puppeteer.onrender.com/scrape/?query=${errorFound}`)
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                console.log(res[0])
                res.forEach((hint) => {
                    let answer = hint.answer
                    let question = hint.question

                    let newEntry = {
                        question: question,
                        answer: answer
                    }
                    console.log(question)
                    setErrorHints(arr => [...arr, newEntry])
                })
            })
    }


    function getErrorHints(outputError) {
        const errorArray = breakString(outputError);
        errorArray.forEach(async err_str => {
            const errorFound = filterError(err_str)
            if (errorFound !== "no error") {
                await callScrapper(errorFound)
            }
        });

        errorHints.forEach((hint) => {
            console.log('Question: ', hint.question, '\n')
        })

    }

    if (result != null) {
        if (result.statusCode == 200) {
            output = result.output
            if (result.cpuTime == null) {
                console.log('hi')
                // getErrorHints(output)
                console.log(errorHints.length)
            }
        } else {
            output = result.error
        }
    }
    return (
        <ScrollView style={{ marginTop: 30, marginHorizontal: 15 }}>
            <Text>Output:{'\n'}</Text>
            <Text>{output}</Text>
            {errorHints.map((hint) => {
                <View>
                    <Text>Q:{hint.question}{'\n'}</Text>
                    <Text>Ans:{hint.answer}</Text>
                </View>
            })}
        </ScrollView>
    )
}

export default ConsoleScreen

const styles = StyleSheet.create({})