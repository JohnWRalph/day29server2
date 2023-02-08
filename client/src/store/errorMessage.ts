import { writable } from "svelte/store";

const errorMessage = writable<string>()

export default errorMessage