import { JDOODLE_CLIENT_ID, JDOODLE_CLIENT_SECRET } from '@env'
import { useNavigation } from '@react-navigation/native'

const compileCode = async (code, language) => {

    let res = null

    try {
        await fetch('https://api.jdoodle.com/v1/execute', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: JDOODLE_CLIENT_ID,
                clientSecret: JDOODLE_CLIENT_SECRET,
                script: code,
                language: language,
                versionIndex: "0",
                stdin: ""
            })
        })
            .then(response => response.json())
            .then(data => {
                res = data
                console.log(res)
            })

    } catch (e) {
        console.log(e)
    }
    // console.log(res)
    return res
}


export default compileCode