<script lang="ts">
    import axios from "axios";
    import { activeUser, activeUserID } from "../store/activeUser";
    import errorMessage from "../store/errorMessage";
    let username: string = "";
    let password: string = "";
    let newUsername: string = "";
    let newPassword: string = "";
    let newPassword2: string = "";

// https://day26-lmnctbg14-yahoongmi.vercel.app
    // if user inputted passwords match, send to server for validation and to be added to global list
    async function submitNewUser() {
        if (newPassword === newPassword2) {
            const result = await axios.post(" http://localhost:3004/user", {
                username: newUsername,
                password: newPassword,
                isNewUser: true,
            });
           
            errorMessage.set(result.data.error);
            username = result.data.username;
            password = result.data.password;
            activeUser.set(username);
            activeUserID.set(result.data.userid);
        } else {
            errorMessage.set("Passwords do not match");
        }
    }

    // send login information to server for validation
    async function loginUser() {
        const result = await axios.post(" http://localhost:3004/user", {
            username: username,
            password: password,
            isNewUser: false,
        });
        errorMessage.set(result.data.error);

        username = result.data.username;
        activeUser.set(result.data.username);
        activeUserID.set(result.data.userid);
    }
</script>

{#if !$activeUser}
    <div class="flex flex-col w-full lg:flex-row">
        <div
            class="grid flex-grow h-62 card bg-base-300 rounded-box place-items-center"
        >
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Returning User</span>
                </label>
                <input
                    bind:value={username}
                    type="text"
                    placeholder="Enter Usernane"
                    class="input input-bordered w-full max-w-xs"
                />

                <label class="label">
                    <span class="label-text" />
                </label>
                <input
                    bind:value={password}
                    type="password"
                    placeholder="Password"
                    class="input input-bordered w-full max-w-xs"
                />
            </div>
            <button
                on:click={async () => await loginUser()}
                class="btn btn-primary">Submit</button
            >
        </div>

        <div class="divider lg:divider-horizontal">OR</div>
        <div
            class="grid flex-grow h-62 card bg-base-300 rounded-box place-items-center"
        >
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">New User</span>
                </label>
                <input
                    bind:value={newUsername}
                    type="text"
                    placeholder="Enter Usernane"
                    class="input input-bordered w-full max-w-xs"
                />

                <label class="label">
                    <span class="label-text" />
                </label>
                <input
                    bind:value={newPassword}
                    type="password"
                    placeholder="Password"
                    class="input input-bordered w-full max-w-xs"
                />
                <input
                    bind:value={newPassword2}
                    type="password"
                    placeholder="Retype Password"
                    class="input input-bordered w-full max-w-xs"
                />
            </div>
            <button
                on:click={async () => await submitNewUser()}
                class="btn btn-primary">Submit</button
            >
        </div>
    </div>
{:else}<br />
{/if}

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    button {
        margin-top: 15px;
    }
</style>
