<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let label: string;
  export let value: number;
  export let decimals: number;
  // const changeMultiplier = 10 ** decimals;

  // let [min, max] = [Math.round(value * 0.185), Math.round(value * 1.925)];

  let textInput: HTMLInputElement;
  let sliderInput: HTMLInputElement;

  function handleChange({ currentTarget: { value } }: { currentTarget: HTMLInputElement }) {
    dispatch('update', { value });
  }

</script>

{#if label }
<span class="label">{label}</span>
{/if}
<button class="input-base" on:click|stopPropagation tabindex={-1}>
  <input bind:this={textInput} class="text-input" type="text" value={value + ''} on:change={handleChange} />
  <!-- <input bind:this={sliderInput} class="slider" type="range" value={value + ''} {min} {max} step={changeMultiplier} on:input={handleChange} /> -->
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

  .input-base {
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