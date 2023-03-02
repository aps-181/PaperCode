import { StyleSheet, SafeAreaView, Button, Image, Text, View } from 'react-native'
import React from 'react'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import { useEffect, useRef, useState } from 'react'

const PhotoScreen = () => {

    let cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [photo, setPhoto] = useState();
    const [zoom, setZoom] = useState(0);

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync()
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
            setHasCameraPermission(cameraPermission.status === "granted")
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
        })();
    }, [])

    if (hasCameraPermission === undefined) {
        return <Text>Requesting permissions...</Text>
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted. Please change in settings</Text>
    }

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    let takePic = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif: false
        }
        console.log(cameraRef.current)
        if (cameraRef) {
            let newPhoto = await cameraRef.current.takePictureAync(options)
            setPhoto(newPhoto)
        }
    }

    if (photo) {
        let sharePic = () => {
            shareAsync(photo.uri).then(() => {
                setPhoto(undefined)
            })
        }

        let savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
                setPhoto(undefined)
            })
        }

        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
                <Button title="Share" onPress={sharePic} />
                {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
                <Button title='Discard' onPress={() => setPhoto(undefined)} />
            </SafeAreaView>
        )
    }

    return (
        <Camera style={styles.container} ref={cameraRef} ratio={"16:9"} zoom={zoom} onCameraReady={onCameraReady}>
            <View style={styles.butttonContainer}>
                <Button title="Take Pic" onPress={takePic} />
                <Button title="Zoom in" onPress={() => { if (zoom <= 0.9) setZoom(zoom + 0.1) }} />
                <Button title="Zoom out" onPress={() => { if (zoom >= 0.1) setZoom(zoom - 0.1) }} />

            </View>
        </Camera>
    )
}

export default PhotoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    butttonContainer: {
        backgroundColor: '#fff',
        alignSelf: 'flex-end'
        // position: 'bottom'
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
})
