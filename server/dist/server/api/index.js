"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const cors_1 = __importDefault(require("cors"));
const validateUserInput_1 = __importDefault(require("../../validateUserInput"));
const validateTaskInput_1 = __importDefault(require("../../validateTaskInput"));
// Import the functions you need from the SDKs you need
const firestore_2 = require("firebase/firestore");
// import { collection, addDoc } from "firebase/firestore";
const dotenv_1 = __importDefault(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
let errorMessage;
const apiKey = process.env.FIREBASECONFIG_APIKEY;
const authDomain = process.env.FIREBASECONFIG_AUTHDOMAIN;
const projectId = process.env.FIREBASECONFIG_PROJECTID;
const storageBucket = process.env.FIREBASECONFIG_STORAGEBUCKET;
const messageSenderId = process.env.FIREBASECONFIG_MESSAGINGSENDERID;
const appId = process.env.FIREBASECONFIG_APPID;
const measurementId = process.env.FIREBASECONFIG_MEASUREMENTID;
const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messageSenderId,
    appId,
    measurementId
};
//   // Initialize Firebase
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
// fetch user input from client, validate input, then reject/accept input 
app.post("/user/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // fetch
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "users"));
        var userList = docRef.docs.map(doc => doc.data());
        console.log("users:", userList.length);
        const username = req.body.username;
        const password = req.body.password;
        const isNewUser = req.body.isNewUser;
        // validate
        try {
            (0, validateUserInput_1.default)(userList, username, password, isNewUser);
        }
        catch (e) {
            errorMessage = e.message;
            // console.log("message:", errorMessage)
            res.send({
                error: e.message
            });
            return;
        }
        //push newly created user to existing users and set active user on server side
        if (isNewUser === true) {
            //construct user
            var userid = userList.length;
            const user = {
                userid: Number(userid),
                username: username,
                password: password
            };
            // let userList;
            if (userList === undefined) {
                userList = [];
            }
            else {
                userList = userList;
            }
            console.log(user);
            // userList.push(user);
            yield (0, firestore_2.setDoc)((0, firestore_2.doc)(database, "users", userid.toString()), {
                user
            });
            res.send(user);
        }
        else {
            const index = userList.findIndex(element => element.user.username === username);
            console.log(index);
            const user = {
                userid: index,
                username: username,
            };
            res.send(user);
        }
    });
});
// Server-side code
app.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // const userid = req.params.userid;
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "users", "9", "task"));
        const todoList = docRef.docs.map(doc => doc.data());
        console.log("DocRef:", todoList);
        res.send(docRef.docs.map(doc => doc.data()));
    });
});
// Recieves userid, returns todos for user
app.get("/todo/:userid", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        var assigned = req.body.assigned;
        const task = req.body.task;
        var completeBy = req.body.completeBy;
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDoc)((0, firestore_2.doc)(database, "todo", userid));
        var todoList = docRef.data();
        console.log("old:", todoList);
        // try {
        //     // validateTaskInput(assigned,task,completeBy,userid,todoList)
        // } catch (e) {
        //     errorMessage = e.message
        //     console.log("message:", errorMessage)
        //     res.send({
        //         error: e.message
        //     })
        //     return;
        // }
        // oldtodoList.push(newToDo)
        if (todoList === undefined) {
            todoList = [];
        }
        else {
            todoList = todoList.todoList;
        }
        res.send(todoList);
    });
});
// Recieve tasks from client, validates it, then add to global list
app.post("/todo/:userid", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userid = req.params.userid;
        var assigned = req.body.assigned;
        const task = req.body.task;
        var completeBy = req.body.completeBy;
        try {
            (0, validateTaskInput_1.default)(assigned, task, completeBy, userid, todoList);
        }
        catch (e) {
            errorMessage = e.message;
            console.log("message:", errorMessage);
            res.send({
                error: e.message
            });
            return;
        }
        const newToDo = {
            userid: Number(userid),
            assigned: assigned,
            task: task,
            completeBy: completeBy,
            done: false,
        };
        // Initialize Cloud Firestore and get a reference to the service
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDoc)((0, firestore_2.doc)(database, "todo", userid));
        var todoList = docRef.data();
        console.log("old:", todoList);
        if (todoList === undefined) {
            todoList = [];
        }
        else {
            todoList = todoList.todoList;
        }
        todoList.push(newToDo);
        yield (0, firestore_2.setDoc)((0, firestore_2.doc)(database, "todo", userid), {
            todoList
        });
        res.send(newToDo);
    });
});
// recieve  task to be removed from client, removes from global todo list, and reorders global index
app.post("/removetodo/:globalTaskID/:userid", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const globalTaskID = req.params.globalTaskID;
        const userid = req.params.userid;
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        console.log(globalTaskID);
        const docRef = yield (0, firestore_1.getDoc)((0, firestore_2.doc)(database, "todo", userid));
        var todoList = docRef.data();
        console.log("old:", todoList);
        if (todoList === undefined) {
            todoList = [];
        }
        else {
            todoList = todoList.todoList;
        }
        console.log("remove:", todoList[globalTaskID]);
        todoList.splice(globalTaskID, 1);
        yield (0, firestore_2.setDoc)((0, firestore_2.doc)(database, "todo", userid), {
            todoList
        });
        res.send(todoList);
    });
});
app.listen(3004);
