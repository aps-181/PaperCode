import DropdownComponent from '../Components/Dropdown';



import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
// import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import CodeEditor, { CodeEditorSyntaxStyles } from '../src';
import { useSelector } from 'react-redux';
import { selectLang } from '../slices/langSlices';

const IDEScreen = () => {

    const lang = useSelector(selectLang)

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
                autoFocus
            />
        </SafeAreaView>
    );

    console.log(lang.value)
};

export default IDEScreen;