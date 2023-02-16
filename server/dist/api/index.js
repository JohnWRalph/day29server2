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
const cors_1 = __importDefault(require("cors"));
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const uuid_1 = require("uuid");
const validateUserCreate_1 = __importDefault(require("../validateUserCreate"));
import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
let errorMessage;
let alertMessage;
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
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
app.get('/user', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("hello");
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "users"));
        var userList = docRef.docs.map(doc => doc.data());
        res.send(userList);
    });
});
app.post('/user', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "users"));
        var userList = docRef.docs.map(doc => doc.data());
        const username = req.body.username;
        const emailAddress = req.body.emailAddress;
        const userid = (0, uuid_1.v4)();
        // validate
        try {
            (0, validateUserCreate_1.default)(username, emailAddress, userList);
        }
        catch (e) {
            errorMessage = e.message;
            res.send({
                error: e.message
            });
            return;
        }
        const user = {
            userid: userid,
            username: username,
            emailAddress: emailAddress
        };
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(database, "users", userid), {
            user
        });
        res.send(user);
    });
});
app.put("/user/:userId", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        const newUsername = req.body.newUsername;
        const newEmailAddress = req.body.newEmailAddress;
        const database = (0, firestore_1.getFirestore)(firebaseApp);
        const docRef = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(database, "users"));
        var userList = docRef.docs.map(doc => doc.data());
        let successMessage;
        try {
            (0, validateUserCreate_1.default)(newUsername, newEmailAddress, userList);
        }
        catch (e) {
            errorMessage = e.message;
            res.send({
                error: e.message
            });
            return;
        }
        const user = {
            userid: userId,
            username: newUsername,
            emailAddress: newEmailAddress
        };
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(database, "users", userId), {
            user
        });
        res.send(user);
    });
});
app.listen(3000);
