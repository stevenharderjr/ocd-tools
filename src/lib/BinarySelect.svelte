<script context="module" lang="ts">
  export interface ToggleOption {
    label: string;
    value: any;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let id: string;
  export let label: string;
  export let options: [ToggleOption, ToggleOption];
  export let selected: any;
  export let orientation = 'horizontal';
  export let shrink = false;
  // export let vertical = false;

  $: [a, b] = options;

  function switchValues() {
    const newValue = selected === a.value ? b.value : a.value;
    dispatch('update', { id, value: newValue });
  }
</script>

<div>
  {#if label}
    <span class="small-caps">{label}</span>
  {/if}
  <button class={orientation + ' base'} on:click={switchValues} style={shrink ? 'height: min-content' : ''}>
    <div class={selected === a.value ? "option selected" : 'option'}>{a.label}</div>
    <div class={selected === b.value ? "option selected" : 'option'}>{b.label}</div>
  </button>
</div>

<style>
  .base {
    /* border: 2px solid #ccc; */
    border: none;
    box-shadow: inset 0 1px 3px #999;
    display: flex;
    background: #eee;
    border-radius: 8px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    align-self: center;
    justify-self: center;
    pointer-events: auto;
  }
  .vertical {
    height: 84px;
    flex-direction: column;
  }
  .horizontal {
    height: 42px;
    flex-direction: row;
  }
  .option {
    width: 100%;
    text-transform: uppercase;
    border-radius: 5px;
    padding: 1px 6px;
    text-align: center;
    font-weight: 100;
    font-size: small;
    color: #888;
    border: 1.5px solid transparent;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .selected {
    padding: 1px 6.5px;
    border: none;
    font-weight: 500;
    color: #000;
    background: #fff;
    box-shadow: 0 1px 4px #0006;
  }
  button {
    pointer-events: auto;
  }
</style>