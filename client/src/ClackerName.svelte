<script lang='ts'>
  import { onMount } from "svelte";
  import App from "./App.svelte";
  import { ClientStateStore } from "./ClientStateStore";
</script>

<input bind:value={$ClientStateStore.user} on:change>

<style>

</style>