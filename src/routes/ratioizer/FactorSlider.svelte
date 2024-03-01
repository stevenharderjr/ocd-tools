<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let id: string;
  export let label: string = '';
  export let prefix: string = '';
  export let suffix: string = '';
  export let value: number;
  export let baseline: number;
  export let decimals: number = 0;
  export let min: number;
  export let max: number;
  export let progressBar = false;
  let elementWidth = 100;
  $: range = max - min;
  $: rate = 1 / (elementWidth / range) * 2;
  $: delta = +(value - baseline!).toFixed(decimals);

  let base: HTMLButtonElement;
  let slider;
  let origin: number | [number, number];
  let direction = 0;
  // let end: [number, number];
  let innerWidth: number;
  let horizontalTouchMove = false;
  let verticalTouchMove = false;

  function dragStart(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    origin = x;
  }

  function dragEnd(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    direction = 0;
    dispatch('reset', { id, value });
  }

  function touchStart(event: TouchEvent) {
    const [{ clientX: x, clientY: y }] = event.touches;
    origin = [x, y];
    direction = 0;
  }

  function touchEnd(event: TouchEvent) {
    direction = 0;
    horizontalTouchMove = false;
    verticalTouchMove = false;
    dispatch('reset', { id, value });
  }

  function handleTouchMove(event: TouchEvent) {
    if (verticalTouchMove) return;
    const [{ clientX: x, clientY: y }] = event.touches;
    const [originX, originY] = (origin as [number, number]);
    const changeH = x - originX;

    // try to prevent horizontal input from interfering with vertical scrolling
    if (!horizontalTouchMove) {
      const changeV = y - originY;
      if (Math.abs(changeV) > Math.abs(changeH)) return verticalTouchMove = true;
    }

    horizontalTouchMove = true;
    event.stopPropagation();
    event.preventDefault();
    const change = ~~(changeH * rate);
    let newValue = value + change;
    if (newValue === value) return;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    if ((newValue > value && direction < 1) || (newValue < value && direction > -1)) origin = [x, y];

    dispatch('update', { id, value: newValue });
  }

  function handleDrag(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    if (x < 1) return;
    const change = ~~((x - (origin as number)) * rate);
    let newValue = value + change;
    if (newValue === value) return;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    if ((newValue > value && direction < 1) || (newValue < value && direction > -1)) origin = x;

    dispatch('update', { id, value: newValue });
  }

  function increment() {
    const newValue = value + 1;
    if (newValue <= max) dispatch('update', { id, value: newValue });
  }

  function decrement() {
    const newValue = value - 1;
    if (newValue >= min) dispatch('update', { id, value: newValue });
  }

  onMount(() => {
    elementWidth = base.offsetWidth;
  });
</script>

{#if label }
  <button class="independent-factor" on:click|stopPropagation>
    <span class="label">{label}</span>
    <div class='dynamics'>
      {#if delta}
        <span class="delta">({+delta > 0 ? '+' : ''}{delta})</span>
      {/if}
      <span class="value">{prefix + value.toFixed(decimals) + suffix}</span>
      <!-- <span class="unit">{factor.unit}</span> -->
    </div>
  </button>
{/if}

<button bind:this={base} class="base" on:mousedown|self|stopPropagation>
  <div class="visible-body">
    {#if progressBar}
      <div class="progress-bar" style={`height:${(100 / range) * value - 8}%`}></div>
    {/if}
  </div>
  <button class="minus" on:click|stopPropagation={decrement}>
    –
  </button>
  <button bind:this={slider} class="slider" on:dragstart={dragStart} on:touchstart={touchStart} on:drag={handleDrag} on:touchend={touchEnd} on:touchmove={handleTouchMove} on:dragend={dragEnd} on:click|stopPropagation draggable={true}>
  </button>
  <button class="plus" on:click|stopPropagation={increment}>
    +
  </button>
</button>

<style>
  .independent-factor {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -3rem;
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

  button {
    pointer-events: auto;
    background: transparent;
    border: none;
    height: 42px;
    display: flex;
  }
  .visible-body {
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    bottom: 5px;
    border-radius: 8px;
    /* background: linear-gradient(to right, #ccc, #eee, #ccc); */
    background: #eee;
    box-shadow: inset 0 1px 3px #999;
    /* box-shadow: 0 0 4px #000; */
    pointer-events: none;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .base {
    user-select: none;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    justify-content: space-between;
    width: calc(100% + 1rem);
    /* width: 100%; */
    margin: 1rem 0 1rem -0.5rem;
  }
  .progress-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    /* border-radius: 21px; */
    pointer-events: none;
    background: linear-gradient(#0002, #0001);
  }
  .plus, .minus {
    line-height: 42px;
    opacity: 0.6;
    width: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .minus {
    justify-self: flex-start;
    padding-bottom: 3px;
    font-size: 1.5rem;
  }
  .plus {
    padding-bottom: 5px;
    font-size: 1.7rem;
    font-weight: 300;
    justify-self: flex-end;
  }
  .slider {
    opacity: 0;
    background: transparent;
    width: 100%;
  }
</style>