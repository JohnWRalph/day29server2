import User from "./domain/user"

function validateTaskInput(assigned, task, completeBy, userid) {
    if (task === "") {
        throw Error(`No task inputted`)
    }
}
export default validateTaskInput