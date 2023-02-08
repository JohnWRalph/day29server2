<script lang="ts">
  import ErrorMessage from "./components/ErrorMessage.svelte";

  import Header from "./components/Header.svelte";
  import Login from "./components/Login.svelte";
  import TodoList from "./components/TodoList.svelte";
  import { activeUser, activeUserID } from "./store/activeUser";

</script>

<div id="header">
  <Header />
</div>
<ErrorMessage />

<Login />
{#if $activeUser}
  <br />
  <TodoList />
{:else}{/if}
<main />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  #header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid white;
  }
</style>
