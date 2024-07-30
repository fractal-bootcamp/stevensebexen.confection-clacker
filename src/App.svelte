<script lang="ts">
    import { ClackerClient } from "./ClackerClient";

    
  let clackCount = 0;
  let user = 'Clacker';

  const client = new ClackerClient(user);

  function clackConfection() {
    // Optimistic display
    clackCount++;
    client.sendClack();
  }

  // client.onCountUpdate(newCount => clackCount = newCount);
</script>

<main>
  <h1>Confection Clacker</h1>
  <button id='confection' on:click={clackConfection}>
    <img src='confection.png' alt='A cookie with pastel pink icing and some sprinkles'>
  </button>
  <p id='clack-count'>Confections clacked: {clackCount}</p>
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
