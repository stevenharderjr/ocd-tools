<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let factor: App.Factor;
  let input: HTMLInputElement;

  $: delta = Math.round(factor.value - factor.baseline!);

  function handleChange({ currentTarget: { value }}: { currentTarget: HTMLInputElement }) {
    const { id } = factor;
    dispatch('update', { id, value });
  }

  onMount(() => {
    input.value = factor.value + '';
    input.min = factor.min + '';
    input.max = factor.max + '';
  });
</script>

{#if factor?.label }
  <button class="independent-factor" on:click|stopPropagation>
    <span class="label">{factor.label}</span>
    <div class='dynamics'>
      {#if delta}
        <span class="delta">({delta > 0 ? '+' : ''}{delta})</span>
      {/if}
      <span class="value">{factor.prefix + Math.round(factor.value) + factor.suffix}</span>
      <!-- <span class="unit">{factor.unit}</span> -->
    </div>
  </button>
{/if}
<button class="slider-base" on:click|stopPropagation tabindex={-1}>
  <input bind:this={input} class="slider" type="range" value={factor.value} min={factor.min} max={factor.max} on:input={handleChange} />
</button>

<style>
  .independent-factor {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -1.5rem;
    border: none;
    background: none;
  }
  .dynamics {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: baseline;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  .label, .value {
    font-size: 1rem;
    font-weight: 300;
    white-space: nowrap;
  }

  .label {
    margin-right: 1rem;
  }

  .delta {
    font-size: small;
    font-weight: 300;
    color: #999;
  }

  .slider-base {
    position: relative;
    left: 0;
    /* background: #f006; */
    border: none;
    background: none;
    height: 4rem;
    /* margin-bottom: 1.5rem; */
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input {
    width: 100%;
  }

</style>