import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeEditor, { CodeEditorSyntaxStyles } from '../src';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectCode } from '../slices/langSlices';






const IDEScreen = ({ route, navigation }) => {

    const code = useSelector(selectCode).data
    const [language, setLanguage] = useState('Select Language')


    useEffect(() => {
        try {
            console.log(`https://71b2-45-249-170-88.ngrok-free.app/?code="${code}"`)
            fetch(`https://a477-2405-201-f001-a082-4c22-40d6-dafb-44c6.ngrok-free.app/getLanguage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: code })
            })
                .then(res => res.json())
                .then((d) => {
                    setLanguage(d["language"])
                    console.log(d["language"])
                })
        } catch (error) {

            console.log("Error:" + error);
            setLanguage('c')
        }
    }, [])

    return (
        <SafeAreaView>

            <CodeEditor
                style={{
                    fontSize: 20,
                    inputLineHeight: 22,
                    highlighterLineHeight: 22,
                }}
                language={language}
                syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
                showLineNumbers
                initialValue={code}
                autoFocus
            />
        </SafeAreaView>
    );

    console.log(lang.value)
};

export default IDEScreen;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 5,
        width: 100,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    codeInput: {
        height: 200,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

