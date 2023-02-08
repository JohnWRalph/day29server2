import express from "express";
import fs from "fs"
import ToDo from "./domain/todo";
import User from "./domain/user";
import cors from "cors"
import validateUserInput from "./validateUserInput";
import validateTaskInput from "./validateTaskInput";

const app = express();
app.use(express.json())
app.use(cors());
let errorMessage;

// get list of existing users
app.get("/user", function (req, res) {
    const userList = fs.readFileSync("./users.json")
    res.send(userList)
})

// fetch user input from client, validate input, then reject/accept input 
app.post("/user", function (req, res) {
    // fetch
    const userList = JSON.parse(fs.readFileSync("./users.json") as any as string);
    const username = req.body.username;
    const password = req.body.password;
    const isNewUser = req.body.isNewUser;

    // validate
    try {
        validateUserInput(userList, username, password, isNewUser)
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
        const user: User = {
            id: userList.length,
            username: username,
            password: password
        }
        userList.push(user);
        fs.writeFileSync("./users.json", JSON.stringify(userList));
        fs.writeFileSync("./activeUser.json", JSON.stringify(user.username));
        res.send(user)
    } else {
        const index = userList.findIndex(element => element.username === username)
        const user = {
            id: index,
            username: username,
        }
        res.send(user)
    }

})


// Server-side code
app.get("/todo/:userid", function (req, res) {
//    console.log("fdf")
    const userid = req.params.userid;
    // console.log(userid)
    const todoList = JSON.parse(fs.readFileSync(`./todo.json`) as any as string);
    // console.log(todoList)
    let result = todoList.filter(function(item) {
        return item.userid === Number(userid);
    })
    // console.log(result)
    res.send(result);
});


// Recieve tasks from client, validates it, then add to global list
app.post("/todo/:userid", function (req, res) {
    const userid = req.params.userid;
    var assigned = req.body.assigned;
    const task = req.body.task;
    var completeBy = req.body.completeBy;
    const todoList = JSON.parse(fs.readFileSync('./todo.json') as any as string);
    try {
        validateTaskInput(assigned,task,completeBy,userid)
    } catch (e) {
        errorMessage = e.message
        console.log("message:", errorMessage)
        res.send({
            error: e.message
        })
        return;
    }
    if (assigned ==="") {
        assigned = new Date().toLocaleDateString()
    } else {

    }
    if (completeBy ==="") {
        completeBy = new Date().toLocaleDateString()
    }
    const newToDo: ToDo = {
        userid: Number(userid),
        taskid: todoList.length,
        assigned: assigned,
        task: task,
        completeBy: completeBy,
        done: false,
    }
   
    todoList.push(newToDo);
    fs.writeFileSync("./todo.json", JSON.stringify(todoList))

    res.send(todoList)
})


// recieve  task to be removed from client, removes from global todo list, and reorders global index
app.post("/removetodo/:globalTaskID", function (req, res) {
    const globalTaskID = req.params.globalTaskID;
    const todoList = JSON.parse(fs.readFileSync('./todo.json') as any as string);
    todoList.splice(globalTaskID,1)
    for (let i =0;i < todoList.length;i++) {
        todoList[i].taskid = i;
    }
    fs.writeFileSync("./todo.json", JSON.stringify(todoList))
    res.send(todoList)
})
app.listen(3004)