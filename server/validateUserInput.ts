

function validateUserInput(userList, username: string, password: string, isNewUser: boolean) {
    console.log(userList)
    console.log("New User:", username)
    console.log("New Pass", password)
    console.log("newuser?", isNewUser)
    if (isNewUser === true) {
        if (username.length > 15) {
            throw Error(`Name is too long, maximum length is 15, got ${username.length}`)
        } if (username.length < 5) {
            throw Error(`Name is too short, minimum length is 5, got ${username.length}`)
        } if (userList.find(u => (u as any).user.username === username)) {
            throw Error(`Username already exists. Select a different username`)
        } if (password.length > 15) {
            throw Error(`Password is too long, maximum length is 15, got ${password.length}`)
        } if (password.length < 5) {
            throw Error(`Password is too short, minimum length is 5, got ${password.length}`)
        }
    } else {
        console.log(userList)
        const index = userList.findIndex(element => (element as any).user.username === username )
        console.log(index)
        if (index === -1) {
            throw Error("Username/ Password combination incorrect")
        } if ((userList[index] as any).user.password !== password ) {
            throw Error("Username/ Password combination incorrect")
        } else {
        }
    } 
}
    export default validateUserInput