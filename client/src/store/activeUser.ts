import { writable } from "svelte/store";


const activeUser = writable<string>();
activeUser.set("")
const activeUserID = writable<number>();
const activeUserTasks = writable<any[]>()
export {activeUser, activeUserID,activeUserTasks}