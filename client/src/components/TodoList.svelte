<script lang="ts">
    import { activeUser, activeUserID } from "../store/activeUser";
    import axios from "axios";
    import errorMessage from "../store/errorMessage";
  

    let todoList = [];
    let assigned: Date;
    let task = "";
    let completeBy: Date;

    // once logged in, get existing User's todo list
    async function getTodoList(userid) {
        try {
            const response = await axios.get(
                `http://localhost:3004/todo/${userid}`
            );
            // console.log(response.data)
            todoList = response.data;

            console.log("heyy", todoList);

            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    // reciever new task input from user, send to server for validation
    async function submitNewTask(userid) {
        console.log("activeuserid:", userid);
        const result = await axios.post(
            `http://localhost:3004/todo/${userid}`,
            {
                userid: userid,
                assigned: assigned,
                task: task,
                completeBy: completeBy,
            }
        );
    
        errorMessage.set(result.data.error);
        console.log(errorMessage);
        console.log("result", result.data);
        getTodoList(userid);
    }

    // remove task from local and global list
    async function removeTask(event) {
      
        const globalTaskID = event.currentTarget.id;
        console.log(globalTaskID);
      
        const result = await axios.post(
            `http://localhost:3004/removetodo/${globalTaskID}/${userid}`
        );

        console.log("resultremove", result.data);
        getTodoList(userid)
      
    }
    const userid = $activeUserID;
    console.log(userid);
    getTodoList(userid);
</script>

<button
    on:click={async () => await submitNewTask($activeUserID)}
    id="submitButton"
    class="btn btn-primary">Submit</button
><br />

<div id="taskTable" class="overflow-x-auto w-full">
    <table class="table w-full">
        <!-- head -->
        <thead id="taskHeader">
            <tr>
                <th>
                    <label>
                        <!-- <input type="checkbox" class="checkbox" /> -->
                    </label>
                </th>
                <th>Date Assigned</th>
                <th>Task</th>
                <th>Complete by</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <!-- row 1 -->
            <tr id="taskInput">
                <th />
                <td>
                    <div class="flex items-center space-x-3">
                        <div>
                            <input
                                bind:value={assigned}
                                type="date"
                                class="input input-bordered w-full max-w-xs"
                            />
                        </div>
                    </div>
                </td>
                <td>
                    <input
                        bind:value={task}
                        type="text"
                        placeholder="Task"
                        class="input input-bordered w-full max-w-xs"
                    />
                    <br />
                </td>
                <td>
                    <div class="flex items-center space-x-3">
                        <div>
                            <input
                                bind:value={completeBy}
                                type="date"
                                placeholder="Enter Usernane"
                                class="input input-bordered w-full max-w-xs"
                            />
                        </div>
                    </div></td
                >
                <th>
                    <!-- <button class="btn btn-ghost btn-xs">details</button> -->
                </th>
            </tr>
            <!-- row 2 -->
            <!-- row 1 -->

            {#each todoList as todo, i}
                <div />
                <tr id="individualTasks">
                    <th>
                        <label>
                            <button
                                id={i.toString()}
                                on:click={removeTask}
                                class="btn btn-square btn-outline"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    /></svg
                                >
                            </button>
                        </label>
                    </th>
                    <td>
                        <div class="flex items-center space-x-3">
                            <div>{todo.assigned}</div>
                        </div>
                    </td>
                    <td>
                        <div id="tasks">
                            {todo.task}
                        </div>

                        <br />
                    </td>
                    <td>
                        <div class="flex items-center space-x-3">
                            <div>{todo.completeBy}</div>
                        </div></td
                    >
                    <th>
                        <!-- <button class="btn btn-ghost btn-xs">details</button> -->
                    </th>
                </tr>
            {/each}
        </tbody>
        <!-- foot -->
        <tfoot>
            <tr>
                <th />
                <th>Date Assigned</th>
                <th>Task</th>
                <th>Complete By</th>
                <th />
            </tr>
        </tfoot>
    </table>
    <br />
</div>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    .table {
        border: 1px solid rgb(92, 216, 92);
        /* background-color: aliceblue; */
    }
    #taskTable {
        overflow-x: hidden;
        position: absolute;
        top: 20%;
        left: 10%;
        width: 80%;
        border: 1px solid rgb(92, 216, 92);
        /* background-color: green; */
        border-radius: 20px;
    }
    #taskHeader {
        border-bottom: 1px solid rgb(92, 216, 92);
        /* background-color: rgb(39, 35, 1); */
    }
    #taskInput {
        border-bottom: 1px solid rgb(92, 216, 92);
        /* background-color: rgb(39, 35, 1); */
    }
    #individualTasks {
        border-top: 1px solid rgb(92, 216, 92);
        border-bottom: 1px solid rgb(92, 216, 92);
        /* background-color: brown; */
    }
    #tasks {
        min-width: 500px;
        max-width: 600px;
        /* height:100px; */
        /* border: 1px solid white; */
        /* overflow: auto; */
        /* overflow-wrap: break-word; */
        /* inline-size: 150px; */
        overflow-wrap: break-word;
        white-space: pre-wrap;
    }

    #submitButton {
        position: absolute;
        top: 11%;
        left: 45%;
    }
</style>
