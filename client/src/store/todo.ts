import { writable } from "svelte/store";

const todoList = writable<string[]>();

export default todoList