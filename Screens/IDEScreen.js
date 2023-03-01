import DropdownComponent from '../Components/Dropdown';



import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
// import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import CodeEditor, { CodeEditorSyntaxStyles } from '../src';
import { useSelector } from 'react-redux';
import { selectLang } from '../slices/langSlices';
const lang = useSelector(selectLang)
console.log(lang)
const IDEScreen = () => {
    return (
        <SafeAreaView>
            <DropdownComponent />
            <CodeEditor
                style={{
                    fontSize: 20,
                    inputLineHeight: 22,
                    highlighterLineHeight: 22,
                }}
                language="javascript"
                syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
                showLineNumbers
                autoFocus
            />
        </SafeAreaView>
    );
};

export default IDEScreen;