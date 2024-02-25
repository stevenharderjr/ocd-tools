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
export let options: ToggleOption[];
export let selected: any;
export let alignment = 'horizontal';

function handleChange(key: string) {
  const selectedOption = options.find(({ label }) => label === key);
  if (!selectedOption || selectedOption.value === selected) return;
  dispatch('change', { id, value: selectedOption.value });
}
</script>

<div class={alignment + ' base'}>
  {#each options as option}
    <li class={selected === option.value ? "option selected" : 'option'}>
      <button on:click={() => handleChange(option.label)}>{option.label}</button>
    </li>
  {/each}
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
  flex-direction: column;
}
.horizontal {
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
}
.selected {
  padding: 1px 6.5px;
  border: none;
  font-weight: 500;
  color: #000;
  background: #fff;
  box-shadow: 0 1px 4px #0006;
}
</style>