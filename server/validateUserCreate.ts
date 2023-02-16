import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";


function validateUserCreate(username: string, emailAddress: string, userList) {


    // const docRef = await getDocs(collection(database, "users"))

    // var userList = docRef.docs.map(doc => doc.data())

    if (username.length > 15) {
        throw Error(`Name is too long, maximum length is 15, recieved ${username.length}`)
    } if (username.length < 5) {
        throw Error(`Name is too short, minimum length is 5, recieved ${username.length}`)
    }
    if (userList.find(u => (u as any).user.username === username)) {
        throw Error(`Username already exists. Select a different username`)
    } if (emailAddress === undefined) {
        throw Error(`No email address detected. Please enter an email address`)
    } if (emailAddress.length < 1) {
        throw Error(`No email address detected. Please enter an email address`)
    } 
    if (emailAddress.length > 64) {
        throw Error(`Email is too long. Max length is 64, recieved ${emailAddress.length}`)
    }

}

export default validateUserCreate