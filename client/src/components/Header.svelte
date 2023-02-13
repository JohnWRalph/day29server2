<script lang="ts">
  import { activeUser } from "../store/activeUser";
</script>

<div class="navbar bg-base-100">
  <a class="btn btn-ghost normal-case text-xl">ToDo List </a>
  {#if $activeUser}
    <div id="activeUser" class="btn btn-ghost normal-case text-xl">
      {$activeUser}
    
    </div>
  {:else}{/if}
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  .navbar {
    background-color: rgb(92, 216, 92);
    color: black;
  }
  #activeUser {
    position: fixed;

    right: 0;
  }
</style>
