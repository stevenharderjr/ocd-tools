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
  export let options: [ToggleOption, ToggleOption];
  export let selected: any;
  export let alignment = 'horizontal';
  // export let vertical = false;

  $: [a, b] = options;

  function switchValues() {
    console.log('switch');
    const newValue = selected === a.value ? b.value : a.value;
    dispatch('change', { id, value: newValue });
  }
</script>

<button class={alignment + ' base'} on:click={switchValues}>
  <div class={selected === a.value ? "selected option" : 'option'}>{a.label}</div>
  <div class={selected === b.value ? "selected option" : 'option'}>{b.label}</div>
</button>

<style>
  .base {
    border: none;
    display: flex;
    background: #eee;
    border-radius: 8px;
    padding: 4px;
    font-size: small;
    color: #333;
    margin-left: -0.5rem;
    justify-content: center;
    align-items: center;
    align-self: center;
    justify-self: center;
    pointer-events: auto;
  }
  .vertical {
    flex-direction: column;
  }
  .horizontal {
    flex-direction: row;
  }
  .option {
    width: 100%;
    text-transform: uppercase;
    border-radius: 4px;
    padding: 0 6px;
    text-align: center;
  }
  .selected {
    font-weight: 500;
    color: #000;
    background: #fff;
  }
</style>