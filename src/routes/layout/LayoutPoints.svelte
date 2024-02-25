<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';
  import type { MeasurementOptions } from '$lib/utils/MeasurementConverter';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let points: number[];
  export let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64 = 8;
  let displayOptions: MeasurementOptions = {};
  $: pointCount = points.length;
  $: span = points[pointCount - 1] - points[0];
  $: displayOptions.precision = precision;
  $: displayOptions.feet = span > 144;

  function cueAudio() {
    console.log('dispatch audio cue');
    dispatch('cue');
  }
</script>

<span style="font-size: small; text-align: center; text-transform: uppercase;">{pointCount} Measurements</span>
<ul>
  {#each points as point, i}
    <li><label for={`point ${i}`}><input id={`point ${i}`} type="checkbox" />{sae(point, displayOptions) || '0"'}</label></li>
  {/each}
</ul>
<div class="audio-controls">
  <button on:click={cueAudio} title="add new layout" style="margin: auto; background: #0009;">
    <img style="filter: invert(1); -webkit-filter: invert(1);" src="headphones.svg" />
  </button>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  ul {
    width: 100%;
    pointer-events: auto;
    list-style: none;
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 2fr 1fr;
    justify-self: center;
  }
  label {
    display: flex;
    align-items: center;
    white-space: nowrap;
    height: 42px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-indent: 6px;
  }
  span {
    white-space: nowrap;
  }
  .label {
    text-transform: uppercase;
    font-size: small;
  }
  .audio-controls {
    position: sticky;
    width: 100%;
    height: 3rem;
    pointer-events: none;
		display: flex;
		justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    padding: 0 1.5rem;
    bottom: 1.5rem;
  }
  .audio-controls img {
    filter: invert(0.1);
    height: 1.25rem;
    width: 1.25rem;
  }
	.audio-controls button {
    pointer-events: auto;
		border-radius: 9999px;
		background: #fffc;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		touch-action: manipulation;
		font-size: 2rem;
		box-shadow: 0 0 4px 2px #0003;
		backdrop-filter: blur(4px);
	}
</style>