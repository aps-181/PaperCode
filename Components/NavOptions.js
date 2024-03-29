import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch } from 'react-redux';
import { setCode } from '../slices/langSlices';

//pickfile function is called here

const data = [
    {
        id: "1",
        title: "New Code",
        image: "https://res.cloudinary.com/djsyh5syl/image/upload/v1677130413/MainProjecr-PaperCode/camera_vodai4.png",
        screen: "PhotoScreen"
    },
    {
        id: "2",
        title: "Code Storage",
        image: "https://res.cloudinary.com/djsyh5syl/image/upload/v1677130424/MainProjecr-PaperCode/folder_j9gcxl.png",
        screen: "IDE"
    }
]


const NavOptions = () => {

    const navigation = useNavigation()
    const dispatch = useDispatch()




    const pickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync();
        if (result.type == "success") {
            let fname = result.name
            let data = await FileSystem.readAsStringAsync(result.uri)
            dispatch(setCode({ data }))
            // console.log(res)
            // return res
        }
    }

    return (
        <View style={styles.centered}>
            <FlatList
                data={data}
                // horizontal
                style={[tw`mt-10`]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[tw`bg-white w-48  rounded-lg mt-12`]}
                        onPress={async () => {
                            if (item.id == 2) {
                                //The pick file function is called when code storage(id = 2) is pressed
                                await pickFile()
                            }
                            navigation.navigate(item.screen)
                        }}
                    >
                        <View>
                            <Image
                                style={[{ width: 140, height: 140, resizeMode: "contain" }, tw`ml-6 mt-3`]}
                                source={{ uri: item.image }}
                            />
                            <View style={[tw`mt-1 ml-7`]}>
                                <Text style={tw`text-lg font-semibold mb--6 text-blue-500`}>{item.title}</Text>
                                <View style={tw`mb-3 ml-23`}>
                                    <Icon color="blue" name="arrowright" type="antdesign" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default NavOptions

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '7%'
    },
})