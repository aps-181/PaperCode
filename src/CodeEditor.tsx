import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    Button,
    Modal,
    View,
    SafeAreaView,
    TextInput,
    Text,
    ScrollView,
    StyleSheet,
    Platform,
    Pressable,
    ColorValue,
    NativeSyntheticEvent,
    TextInputScrollEventData,
    TextInputKeyPressEventData,
    TextInputSelectionChangeEventData,
} from 'react-native';
import SyntaxHighlighter, {
    SyntaxHighlighterStyleType,
    SyntaxHighlighterSyntaxStyles,
} from './SyntaxHighlighter';
import { Languages } from './languages';
import * as Braces from './braces';
import * as Indentation from './indentation';
import * as Strings from './strings';
import { Dropdown } from 'react-native-element-dropdown';
import { shareAsync } from 'expo-sharing'
import * as FileSystem from 'expo-file-system';
import compileCode from '../Components/compileCode';
import { useDispatch, useSelector } from 'react-redux';
import { setOutput, } from '../slices/langSlices';

export type CodeEditorStyleType = SyntaxHighlighterStyleType & {
    /**
     * Editor height.
     */
    height?: string | number;

    /**
     * Editor width.
     */
    width?: string | number;

    /**
     * Editor top margin.
     */
    marginTop?: string | number;

    /**
     * Editor bottom margin.
     */
    marginBottom?: string | number;

    /**
     * Use this property to align the text input with the syntax highlighter text.
     * @see highlighterLineHeight
     */
    inputLineHeight?: number;

    /**
     * Use this property to help you align the text input with the syntax highlighter text.
     * Do not use in production.
     * @see highlighterColor
     */
    inputColor?: ColorValue;
};

export const CodeEditorSyntaxStyles = SyntaxHighlighterSyntaxStyles;

type Props = {
    /**
     * Editor styles.
     */
    style?: CodeEditorStyleType;

    /**
     * Programming language to support.
     */
    language: Languages;

    /**
     * Syntax highlighting style.
     * @See https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_STYLES_HLJS.MD
     */
    syntaxStyle?: typeof CodeEditorSyntaxStyles;

    /**
     * Initial value on render.
     */
    initialValue?: string;

    /**
     * On value change.
     */
    onChange?: (newValue: string) => void;

    /**
     * On key press.
     */
    onKeyPress?: (key: string) => void;

    /**
     * Whether to show line numbers next to each line.
     */
    showLineNumbers?: boolean;

    /**
     * Make the editor read only.
     */
    readOnly?: boolean;

    /**
     * Focus the code editor on component mount.
     */
    autoFocus?: boolean;

    /**
     * Test ID used for testing.
     */
    testID?: string;
};

type PropsWithForwardRef = Props & {
    forwardedRef: React.Ref<TextInput>;
};

type TextInputSelectionType = {
    start: number;
    end: number;
};

const CodeEditor = (props: PropsWithForwardRef): JSX.Element => {
    const {
        style,
        language,
        syntaxStyle = CodeEditorSyntaxStyles.atomOneDark,
        initialValue = '',
        onChange,
        onKeyPress,
        showLineNumbers = false,
        readOnly = false,
        autoFocus = true,
        testID,
        forwardedRef,
    } = props;

    const {
        width = undefined,
        height = undefined,
        marginTop = undefined,
        marginBottom = undefined,
        inputLineHeight = undefined,
        inputColor = 'rgba(0,0,0,0)',
        ...addedStyle
    } = style || {};

    const {
        fontFamily = Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
        fontSize = 16,
        padding = 16,
    } = addedStyle;

    const [value, setValue] = useState<string>(initialValue);
    const highlighterRef = useRef<ScrollView>(null);
    const inputRef = useRef<TextInput>(null);
    const inputSelection = useRef<TextInputSelectionType>({ start: 0, end: 0 });
    const [codeLanguage, setCodeLanguage] = useState<string | undefined>('')
    const [showModal, setShowModal] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string>('')




    const dispatch = useDispatch()


    // Only when line numbers are showing
    const lineNumbersPadding = showLineNumbers ? 1.75 * fontSize : undefined;

    // Sync forwardedRef with inputRef
    useImperativeHandle(forwardedRef, () => inputRef.current!, [inputRef]);

    useEffect(() => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange, value]);

    // Negative values move the cursor to the left
    const moveCursor = (current: number, amount: number) => {
        const newPosition = current + amount;
        inputRef.current?.setNativeProps({
            selection: {
                start: newPosition,
                end: newPosition,
            },
        });
        return newPosition;
    };

    const addIndentation = (val: string) => {
        let cursorPosition = inputSelection.current.start - 1;

        // All lines before the cursor
        const preLines = val.substring(0, cursorPosition).split('\n');
        const indentSize = Indentation.getSuggestedIndentSize(preLines);
        let indentation = Indentation.createIndentString(indentSize);

        // Add newline and indentation on a regular brace pair
        const leftChar = val[cursorPosition - 1] || '';
        const rightChar = val[cursorPosition + 1] || '';
        if (Braces.isBracePair(leftChar, rightChar)) {
            let addedIndentionSize = Braces.isRegularBrace(leftChar)
                ? Math.max(indentSize - Indentation.INDENT_SIZE, 0)
                : indentSize;
            indentation += '\n' + Indentation.createIndentString(addedIndentionSize);
            // Don't update local cursor position to insert all new changes in one insert call
            moveCursor(cursorPosition, -addedIndentionSize);
        }

        return Strings.insertStringAt(val, cursorPosition, indentation);
    };

    const addClosingBrace = (val: string, key: string) => {
        let cursorPosition = inputSelection.current.start;
        cursorPosition = moveCursor(cursorPosition, -1);
        return Strings.insertStringAt(val, cursorPosition, Braces.getCloseBrace(key));
    };

    const handleChangeText = (text: string) => {
        setValue(Strings.convertTabsToSpaces(text));
    };

    const handleScroll = (e: NativeSyntheticEvent<TextInputScrollEventData>) => {
        // Match text input scroll with syntax highlighter scroll
        const y = e.nativeEvent.contentOffset.y;
        highlighterRef.current?.scrollTo({ y, animated: false });
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = e.nativeEvent.key;
        switch (key) {
            case 'Enter':
                setTimeout(() => {
                    setValue((curr) => addIndentation(curr));
                }, 10);
                break;
            default:
                if (Braces.isOpenBrace(key)) {
                    setTimeout(() => {
                        setValue((curr) => addClosingBrace(curr, key));
                    }, 10);
                }
                break;
        }
        if (onKeyPress) {
            onKeyPress(key);
        }
    };

    const handleSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        inputSelection.current = e.nativeEvent.selection;
    };

    const compile = async () => {
        const res = await compileCode(value, codeLanguage)
        console.log(res)
        dispatch(setOutput(res))
    }

    const saveFile = async (uri: string, filename: string, mimetype: string) => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 })
                    })
                    .catch(e => console.log(e))
            } else {
                shareAsync(uri)
            }
            console.log('Done saving')
        } else {
            shareAsync(uri)
        }
    }

    const makeFile = async () => {
        // console.log(fileName)

        let fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, value, { encoding: FileSystem.EncodingType.UTF8 });
        saveFile(fileUri, fileName, "text/plain")
    }
    const getFileName = () => {
        setShowModal(true);
    }


    const data = [
        { label: 'Python', value: 'python' },
        { label: 'Javascript', value: 'javascript' },
        { label: 'Java', value: 'java' },
        { label: 'C', value: 'c' },
        { label: 'C++', value: 'cpp' },
    ];

    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Language"
                    searchPlaceholder="Search..."
                    value={codeLanguage}
                    onChange={item => {
                        setCodeLanguage(item.value)
                        // console.log(item)
                    }}
                // renderLeftIcon={() => (
                //   // <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                //   <Text>Language</Text>
                // )}
                />

                <View style={{
                    marginBottom: 5,
                }}>
                    <Button
                        title="Save"
                        onPress={getFileName}
                    />
                </View>
                <View style={{
                    marginBottom: 5,
                    marginRight: 10
                }}>
                    <Button
                        title="Run"
                        onPress={compile}
                    />
                </View>
            </View>
            <View style={{ width, height, marginTop, marginBottom }} testID={testID}>

                <SyntaxHighlighter
                    language={codeLanguage}
                    addedStyle={addedStyle}
                    syntaxStyle={syntaxStyle}
                    scrollEnabled={true}
                    showLineNumbers={showLineNumbers}
                    testID={`${testID}-syntax-highlighter`}
                    ref={highlighterRef}
                >
                    {value}
                </SyntaxHighlighter>
                <TextInput
                    style={[
                        styles.input,
                        {
                            lineHeight: inputLineHeight,
                            color: inputColor,
                            fontFamily: fontFamily,
                            fontSize: fontSize,
                            padding,
                            paddingTop: padding,
                            paddingLeft: lineNumbersPadding,
                        },
                    ]}
                    value={value}
                    onChangeText={handleChangeText}
                    onScroll={handleScroll}
                    onKeyPress={handleKeyPress}
                    onSelectionChange={handleSelectionChange}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    autoFocus={autoFocus}
                    // keyboardType="ascii-capable"
                    editable={!readOnly}
                    testID={`${testID}-text-input`}
                    // ref={inputRef}
                    multiline
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setShowModal(!showModal);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Enter file name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={fname => setFileName(fname)}
                        ></TextInput>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setShowModal(!showModal)
                                if (fileName.trim() !== "") makeFile()
                            }}>
                            <Text style={styles.textStyle}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const CodeEditorWithForwardRef = React.forwardRef<TextInput, Props>((props, ref) => (
    <CodeEditor {...props} forwardedRef={ref} />
));

export default CodeEditorWithForwardRef;

const styles = StyleSheet.create({
    input: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        textAlignVertical: 'top',
    },
    dropdown: {
        marginBottom: 5,
        marginHorizontal: 16,
        height: 15,
        width: '40%',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 22,
        marginBottom: 7
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
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