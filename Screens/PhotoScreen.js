import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import Button from '../Components/Button';
import { API_KEY } from '@env';

const PhotoScreen = ({ navigation }) => {

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
    const [updateImage, setUpdateImage] = useState(null)
    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus == 'granted')
        })();
    }, [])

    const gammaCorrection = async () => {

        try {
            let response = await fetch('https://mdl16.pythonanywhere.com/gammacorrection', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: image.base64 })
            })
                .then(res => {
                    return res.json()
                })
                .then(
                    (result) => {
                        setUpdateImage(result['data'])
                        submitToGoogle()
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        } catch (e) {
            console.log(e)
        }
    }



    const submitToGoogle = async () => {
        try {
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            // { type: 'LABEL_DETECTION', maxResults: 10 },
                            // { type: 'TEXT_DETECTION', maxResults: 2 },
                            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
                        ],
                        image: {

                            "content": updateImage
                        }
                    }
                ]
            });
            let response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'

                    },
                    method: 'POST',
                    body: body
                }
            );
            let responseJson = await response.json();
            console.log(responseJson.responses[0].fullTextAnnotation.text)
            const code = responseJson.responses[0].fullTextAnnotation.text;
            toIdeScreen(code)

            // setGoogleResponse(responseJson)
            // console.log(googleResponse)
        } catch (error) {

            console.log("Error:" + error);
        }
    };


    const toIdeScreen = (data) => {
        navigation.navigate('IDE', { code: data })
    }

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const options = { quality: 0.5, base64: true };
                const data = await cameraRef.current.takePictureAsync(options);
                // console.log(data.base64)
                setImage(data)
            } catch (e) {
                console.log(e)
            }
        }
    }

    // if (hasCameraPermission == false) {
    //     return (<Text>Permission to access camera not granted</Text>)
    // }

    return (
        <View style={styles.container}>
            {!image ?
                <Camera
                    style={styles.camera}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef}
                    ratio='16:9'
                >
                    <View style={{
                        alignItems: 'flex-start',
                        paddingTop: 30,
                        paddingHorizontal: 20

                    }}>
                        <Button icon={'flash'}
                            color={flash === Camera.Constants.FlashMode.off ? '#f1f1f1' : 'gold'}
                            onPress={() => {
                                setFlash(flash === Camera.Constants.FlashMode.off ?
                                    Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.off
                                )
                            }} />
                    </View>
                </Camera>
                :
                <Image source={{ uri: image.uri }} style={styles.camera} />
            }
            <View>
                {image ?
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 50
                    }}>
                        <Button title={"Re-Take"} icon="retweet" onPress={() => setImage(null)} />
                        <Button title={"Save"} icon="check" onPress={gammaCorrection} />

                    </View>
                    :
                    <Button title={'Take a Picture'} icon="camera" onPress={takePicture} />
                }
            </View>
        </View>
    )
}

export default PhotoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center'
    },
    camera: {
        flex: 1,
    }
})