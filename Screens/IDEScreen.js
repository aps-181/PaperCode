import DropdownComponent from '../Components/Dropdown';



import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
// import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import CodeEditor, { CodeEditorSyntaxStyles } from '../src';
import { useSelector } from 'react-redux';
import { selectLang } from '../slices/langSlices';

const IDEScreen = ({ route, navigation }) => {

    const lang = useSelector(selectLang)
    const { code } = route.params

    const dummy = "How are you today\nHow are you"

    return (
        <SafeAreaView>
            <DropdownComponent />
            <CodeEditor
                style={{
                    fontSize: 20,
                    inputLineHeight: 22,
                    highlighterLineHeight: 22,
                }}
                language={lang.value}
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