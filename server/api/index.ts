import express from "express";
import fs from "fs"
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, addDoc, getDoc, query, where, updateDoc } from "firebase/firestore";
import ToDo from "../domain/todo";
import User from "../domain/user";
import cors from "cors"
import validateUserInput from "../validateUserInput";
import validateTaskInput from "../validateTaskInput";

// Import the functions you need from the SDKs you need

import { doc, setDoc } from "firebase/firestore";
// import { collection, addDoc } from "firebase/firestore";
import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const app = express();
app.use(express.json())
app.use(cors());

let errorMessage;
const apiKey = process.env.FIREBASECONFIG_APIKEY

const authDomain = process.env.FIREBASECONFIG_AUTHDOMAIN
const projectId = process.env.FIREBASECONFIG_PROJECTID
const storageBucket = process.env.FIREBASECONFIG_STORAGEBUCKET
const messageSenderId = process.env.FIREBASECONFIG_MESSAGINGSENDERID
const appId = process.env.FIREBASECONFIG_APPID
const measurementId = process.env.FIREBASECONFIG_MEASUREMENTID
const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messageSenderId,
    appId,
    measurementId
}

//   // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig as any);


// fetch user input from client, validate input, then reject/accept input 
app.post("/user/", async function (req, res) {
    // fetch
    const database = getFirestore(firebaseApp);
    const docRef = await getDocs(collection(database, "users"))
    var userList = docRef.docs.map(doc => doc.data())

    const username = req.body.username;
    const password = req.body.password;
    const isNewUser = req.body.isNewUser;

    // validate
    try {
        validateUserInput(userList as any, username, password, isNewUser)
    } catch (e) {
        errorMessage = e.message
        // console.log("message:", errorMessage)
        res.send({
            error: e.message
        })
        return;
    }

    //push newly created user to existing users and set active user on server side
    if (isNewUser === true) {
        //construct user

        var userid = userList.length;
        const user: User = {
            userid: Number(userid),
            username: username,
            password: password
        }
        // let userList;
        if (userList === undefined) {
            userList = []
        } else {
            userList = userList
        }

        // userList.push(user);

        await setDoc(doc(database, "users", userid.toString()), {
            user
        });
        res.send(user)


    } else {
        const index = userList.findIndex(element => element.user.username === username)
    
        const user = {
            userid: index,
            username: username,
        }
        res.send(user)
    }

})

// Server-side code
app.get("/", async function (req, res) {

    // const userid = req.params.userid;
    const database = getFirestore(firebaseApp);
    const docRef = await getDocs(collection(database, "users", "9", "task"))
    const todoList = docRef.docs.map(doc => doc.data())


    res.send(docRef.docs.map(doc => doc.data()));
});

// Recieves userid, returns todos for user
app.get("/todo/:userid", async function (req, res) {
    const userid = req.params.userid;
    var assigned = req.body.assigned;
    const task = req.body.task;
    var completeBy = req.body.completeBy;
    const database = getFirestore(firebaseApp);
    const docRef = await getDoc(doc(database, "todo", userid))
    var todoList = docRef.data()
    console.log("old:", todoList)
    if (todoList === undefined) {
        todoList = []
    } else {
        todoList = todoList.todoList
    }

    res.send(todoList)
})
// Recieve tasks from client, validates it, then add to global list
app.post("/todo/:userid", async function (req, res) {
    const userid = req.params.userid;
    var assigned = req.body.assigned;
    const task = req.body.task;
    var completeBy = req.body.completeBy;

    try {
        validateTaskInput(assigned,task,completeBy,userid,todoList)
    } catch (e) {
        errorMessage = e.message
      
        res.send({
            error: e.message
        })
        return;
    }
   

    const newToDo: ToDo = {
        userid: Number(userid),
        assigned: assigned,
        task: task,
        completeBy: completeBy,
        done: false,
    }

    // Initialize Cloud Firestore and get a reference to the service
    const database = getFirestore(firebaseApp);
    const docRef = await getDoc(doc(database, "todo", userid))
    var todoList = docRef.data()
 

    if (todoList === undefined) {
        todoList = []
    } else {
        todoList = todoList.todoList
    }

    todoList.push(newToDo)

    await setDoc(doc(database, "todo", userid), {

        todoList
    })

    res.send(newToDo)
})

// recieve  task to be removed from client, removes from global todo list, and reorders global index
app.post("/removetodo/:globalTaskID/:userid", async function (req, res) {
    const globalTaskID = req.params.globalTaskID;
    const userid = req.params.userid
    const database = getFirestore(firebaseApp);


    const docRef = await getDoc(doc(database, "todo", userid))
    var todoList = docRef.data()
   

    if (todoList === undefined) {
        todoList = []
    } else {
        todoList = todoList.todoList
    }
    console.log("remove:", todoList[globalTaskID])

    todoList.splice(globalTaskID, 1)
    await setDoc(doc(database, "todo", userid), {

        todoList
    })

    res.send(todoList)
})
app.listen(3004)