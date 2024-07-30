<script lang="ts">
  import { ClackerClient } from "./ClackerClient";
  import {ClientStateStore} from './ClientStateStore';
  import ClackerName from './ClackerName.svelte';

  const client = new ClackerClient($ClientStateStore.user);

  function clackConfection() {
    client.sendClack();
  }

  let rateLimited = false;
  $: rateLimited = isRateLimited($ClientStateStore.nextRefresh);

  function isRateLimited(nextRefresh: number): boolean {
    const dateNow = Date.now();
    const delta = nextRefresh - dateNow;
    const result = delta >= 0;
    if (result) {
      setTimeout(() => {ClientStateStore.update(state => ({...state, nextRefresh: 0}))}, delta);
    }
    return result;
  }

  function onUserChange() {
    client.sendIdentity($ClientStateStore.user);
  }
</script>

<main>
  <h1>Confection Clacker</h1>
  <button id='confection' on:click={clackConfection}>
    <img style='height: 30vh' src='confection.png' alt='A cookie with pastel pink icing and some sprinkles'>
  </button>
  <p id='clack-count'>Confections clacked: {$ClientStateStore.count}</p>
  <ClackerName on:change={onUserChange} />
  {#if !$ClientStateStore.connected}
    <p id='error'>(Not connected to server.)</p>
  {:else if rateLimited}
    <p id='error'>You're clacking too quickly! Please wait.</p>
  {/if}
</main>

<style>
  #confection {
    background-color: transparent;
    outline: none;
    border: none;
    transition: transform 0.2s ease
  }

  #confection:hover {
    transform: scale(1.05);
  }

  #confection:active {
    transform: scale(1);
  }

  #clack-count {
    font-size: 32px;
  }
</style>
