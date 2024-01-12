<script>
	import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { blur } from '../stores';

  export let toasts = [];
  $: $blur = toasts.some(t => !!t.blur);

  function dismiss() {
    const { dismissable, dismiss } = toasts[0];
    if (dismissable) dismiss();
  }
</script>

{#if toasts?.[0]?.message}
<div class={`backdrop${$blur ? '' : ' non-blocking'}`} on:click={dismiss}>
  {#each toasts as toast, i}
    <div class="container">
      {#if toast.title}
        <h2 class={toast.type}>{toast.title}</h2>
      {/if}
      <p>{toast.message}</p>
    </div>
    {/each}
  </div>
    {/if}

<style>
  .error {
    color: #f77;
  }

  .non-blocking {
    pointer-events: none;
  }

  .backdrop {
    position: absolute;
    z-index: 7;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .container {
    width: 32rem;
    max-width: 90%;
    padding: 1rem;
    background: #000c;
    border-radius: 8px;
    pointer-events: none;
    margin-bottom: 1rem;
    backdrop-filter: blur(4px);
  }

  h2 {
    margin-bottom: 1rem;
  }

  p {
    color: #fff;
    margin: 1rem;
    hyphens: auto;
  }
</style>