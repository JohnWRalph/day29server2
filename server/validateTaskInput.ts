

function validateTaskInput(assigned, task, completeBy, userid,todoList) {
    console.log("task",task)
    if (task === "") {
        throw Error(`No task inputted`)
    } if (assigned === undefined) {
        throw Error("No start Date inputted")
    } if (completeBy === undefined) {
        throw Error("No complete date inputted")
    }
}
export default validateTaskInput