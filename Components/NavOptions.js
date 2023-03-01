import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';

const data = [
    {
        id: "123",
        title: "New Code",
        image: "https://res.cloudinary.com/djsyh5syl/image/upload/v1677130413/MainProjecr-PaperCode/camera_vodai4.png",
        screen: "PhotoScreen"
    },
    {
        id: "124",
        title: "Code Storage",
        image: "https://res.cloudinary.com/djsyh5syl/image/upload/v1677130424/MainProjecr-PaperCode/folder_j9gcxl.png",
        screen: "IDE"
    }
]


const NavOptions = () => {

    const navigation = useNavigation()

    return (
        <FlatList
            data={data}
            // horizontal
            style={tw`mt-10`}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={tw`ml-25 mt-20 bg-white w-50  rounded-lg`}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <View>
                        <Image
                            style={[{ width: 150, height: 150, resizeMode: "contain" }, tw`ml-6 mt-3`]}
                            source={{ uri: item.image }}
                        />
                        <View style={tw`mt-1 ml-7`}>
                            <Text style={tw`text-lg font-semibold mb--6 text-blue-500`}>{item.title}</Text>
                            <View style={tw`mb-3 ml-23`}>
                                <Icon color="blue" name="arrowright" type="antdesign" />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}

export default NavOptions

const styles = StyleSheet.create({})