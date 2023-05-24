import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectOutput } from '../slices/langSlices'
import ModalComponent from '../Components/ModalComponent'

const ConsoleScreen = () => {

    // const errorHints = []
    const [errorHints, setErrorHints] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [errorHintsStatus, setErrorHintsStatus] = useState('No hints to show')

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };



    const result = useSelector(selectOutput)
    let output = "No output to be displayed"











    async function handleError() {
        console.log('Entering handleError')
        setErrorHintsStatus('Searching for hints...')
        await getErrorHints(output)
            .then(() => {
                console.log("reached handle error", errorHints.length)
                setErrorHintsStatus('No hints to show')
            })

    }



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
                console.log(errorFound, '/n', res, '/n')
                let temp = [...errorHints]

                console.log('Before entering ', temp.length)
                for (let i = 0; i < 4; i++) {
                    let answer = res[i].answer
                    let question = res[i].question

                    let newEntry = {
                        question: question,
                        answer: answer
                    }
                    temp.push(newEntry)
                    console.log('After each push:', temp.length, '/n')
                }
                console.log(temp)
                console.log('After entering', temp.length)
                setErrorHints(temp)
            })
    }


    async function getErrorHints(outputError) {
        const errorArray = breakString(outputError);
        for (let err_str of errorArray) {

            const errorFound = filterError(err_str)
            if (errorFound !== "no error") {
                await callScrapper(errorFound)
            }
        }
    }



    if (result != null) {
        if (result.statusCode == 200) {
            output = result.output
        } else {
            output = result.error
        }
    }

    return (
        <View style={{ marginTop: 30, marginHorizontal: 15 }}>

            <Text>Output:{'\n'}</Text>
            <Text>{output}</Text>
            {(result != null && result.cpuTime == null) && <Button title="Hints" onPress={handleOpenModal} />}


            <Modal visible={showModal} animationType="slide" onRequestClose={handleCloseModal} transparent={true}>
                <View style={styles.modalContainer}>

                    <View style={styles.box}>
                        <Button title="Get Hints" onPress={handleError} />
                        <Button title="Clear" onPress={() => { setErrorHints([]) }} />

                        <ScrollView>
                            {errorHints.length > 0 && errorHints.map((hint, key) => {
                                return (
                                    <View key={key} style={{ padding: 10 }}>
                                        <Text>Question: {hint.question}</Text>
                                        <Text>Answer: {hint.answer}</Text>
                                    </View>
                                )
                            })}
                            {errorHints.length <= 0 && <Text style={styles.boxText}>{errorHintsStatus}</Text>}
                        </ScrollView>
                    </View>
                    <Button title="Close" onPress={handleCloseModal} />
                </View>
            </Modal>
        </View>
    )
}

export default ConsoleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {

        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
})