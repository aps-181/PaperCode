import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeEditor, { CodeEditorSyntaxStyles } from '../src';
import { useSelector } from 'react-redux';

import { selectCode } from '../slices/langSlices';






const IDEScreen = ({ route, navigation }) => {




    const code = useSelector(selectCode).data

    return (
        <SafeAreaView>

            <CodeEditor
                style={{
                    fontSize: 20,
                    inputLineHeight: 22,
                    highlighterLineHeight: 22,
                }}
                language={'javascript'}
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

