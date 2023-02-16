import express from "express"
import User from "../domain/user"
import cors from "cors"
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore"
import { v4 as uuidV4 } from "uuid"
import validateUserCreate from "../validateUserCreate";
// import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config()
const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(cors())

let errorMessage;
let alertMessage;

// const apiKey = process.env.FIREBASECONFIG_APIKEY
// const authDomain = process.env.FIREBASECONFIG_AUTHDOMAIN
// const projectId = process.env.FIREBASECONFIG_PROJECTID
// const storageBucket = process.env.FIREBASECONFIG_STORAGEBUCKET
// const messageSenderId = process.env.FIREBASECONFIG_MESSAGINGSENDERID
// const appId = process.env.FIREBASECONFIG_APPID
// const measurementId = process.env.FIREBASECONFIG_MEASUREMENTID
// const firebaseConfig = {
//     apiKey,
//     authDomain,
//     projectId,
//     storageBucket,
//     messageSenderId,
//     appId,
//     measurementId
// }
const firebaseConfig = {
    apiKey: "AIzaSyDlScYuL98ie3tKlUYyh6-vX7bPg8ZNFO0",
    authDomain: "day29-4fec3.firebaseapp.com",
    projectId: "day29-4fec3",
    storageBucket: "day29-4fec3.appspot.com",
    messagingSenderId: "256472078999",
    appId: "1:256472078999:web:5d635b12d6f83f5a8867d2",
    measurementId: "G-GNJSLWTBCJ"
};
const firebaseApp = initializeApp(firebaseConfig);


app.get('/user', async function (req, res) {
    console.log("hello")
    const database = getFirestore(firebaseApp);
    const docRef = await getDocs(collection(database, "users"))
    var userList = docRef.docs.map(doc => doc.data())

    res.send(userList)
})

app.post('/user', async function (req, res) {
    const database = getFirestore(firebaseApp);
    const docRef = await getDocs(collection(database, "users"))
    var userList = docRef.docs.map(doc => doc.data())


    const username: string = req.body.username;
    const emailAddress: string = req.body.emailAddress
    const userid: string = uuidV4()

    // validate
    try {
        validateUserCreate(username, emailAddress, userList)
    } catch (e) {

        errorMessage = e.message

        res.send({
            error: e.message
        })
        return;
    }

    const user: User = {
        userid: userid,
        username: username,
        emailAddress: emailAddress
    }

    await setDoc(doc(database, "users", userid), {
        user
    })
    res.send(user)
})

app.put("/user/:userId", async function (req, res) {
    const userId = req.params.userId;
    const newUsername = req.body.newUsername;
    const newEmailAddress = req.body.newEmailAddress
    const database = getFirestore(firebaseApp);
    const docRef = await getDocs(collection(database, "users"))
    var userList = docRef.docs.map(doc => doc.data())
    let successMessage: string;

    try {
        validateUserCreate(newUsername, newEmailAddress, userList)
    } catch (e) {

        errorMessage = e.message

        res.send({
            error: e.message
        })
        return;
    }
    const user: User = {
        userid: userId,
        username: newUsername,
        emailAddress: newEmailAddress
    }

    await setDoc(doc(database, "users", userId), {
        user
    })




    res.send(user)
})

app.listen(3000)