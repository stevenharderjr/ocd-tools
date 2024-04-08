<script lang="ts">
  import { round } from '$lib/utils/round';
	import { decimalsByPrecision, precisionByDecimals, type MeasurementPrecision } from '$lib/utils/MeasurementConverter';
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let id: string;
  export let value: number;
  export let range: [number, number]
  export let progressBar = false;
  export let precision: MeasurementPrecision = 1;
  const precisionStep = 42;
  let precisionIndex = decimalsByPrecision[precision];
  let elementWidth = 100;
  const dragTolerance = 1.1;
  $: [min, max] = range;
  $: diff = max - min;
  $: rate = (1 / round(precision / 2, Math.max(precision / 2 , 1))) / (elementWidth / diff);
  // $: decimals = decimalsByPrecision[precision];

  let base: HTMLButtonElement;
  let slider;
  let origin: [number, number];
  let direction = 0;
  // let end: [number, number];
  let innerWidth: number;
  let horizontalTouchMove = false;
  let verticalTouchMove = false;

  function dragStart(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    origin = [x, y];
    // dispatch('update', { precision: 1 });
  }

  function dragEnd(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    direction = 0;
    dispatch('reset', { id, value, precision: undefined });
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
    dispatch('reset', { id, value, precision: undefined });
  }

  function handleTouchMove(event: TouchEvent) {
    if (verticalTouchMove) return;
    const [{ clientX: x, clientY: y }] = event.touches;
    const [originX, originY] = (origin as [number, number]);
    const deltaH = x - originX;
    const deltaV = y - originY;

    // try to prevent horizontal input from interfering with vertical scrolling
    if (!horizontalTouchMove && Math.abs(deltaV) > Math.abs(deltaH)) return verticalTouchMove = true;

    horizontalTouchMove = true;
    event.stopPropagation();
    event.preventDefault();

    const deltaValue = deltaH * rate;
    let newValue = Math.round((value + (deltaValue * (1 / precision))) * precision) / precision;
    const dynamicPrecision = precisionFromPixels(deltaV);
    if (newValue === value && dynamicPrecision === precision) return;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    if ((newValue > value && direction < 1) || (newValue < value && direction > -1)) origin = [x, originY];

    dispatch('update', { id, value: newValue, precision: dynamicPrecision });
    if (dynamicPrecision !== precision) dispatch('reset', { id, precision: dynamicPrecision });
  }

  function handleDrag(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    const [originX, originY] = origin;
    if (x < 1) return;
    // const change = ~~((x - (origin as number)) * rate);
    const deltaX = (x - originX as number) * rate;
    const deltaY = Math.abs(y - originY);
    const dynamicPrecision = precisionFromPixels(deltaY);
    // let newValue = +(value + change).toFixed(decimals);
    let newValue = Math.round((value + (deltaX * (1 / precision))) * precision) / precision;
    if (newValue === value && dynamicPrecision === precision) return;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    if ((newValue > value && direction < 1) || (newValue < value && direction > -1)) origin = [x, originY];

    dispatch('update', { id, value: newValue, precision: dynamicPrecision });
    if (dynamicPrecision !== precision) dispatch('reset', { id, precision: dynamicPrecision });
  }

  function increment() {
    const preciseValue = round(value, precision);
    const newValue = preciseValue > value ? preciseValue : round(value + (1 / precision), precision);
    if (newValue <= max) dispatch('update', { id, value: newValue });
  }

  function decrement() {
    const preciseValue = round(value, precision);
    const newValue = preciseValue < value ? preciseValue : round(value - (1 / precision), precision);
    if (newValue >= min) dispatch('update', { id, value: newValue });
  }

  function precisionFromPixels(pixels: number) {
    const decimals = 4 - Math.min(Math.round(pixels / precisionStep), 4);
    return precisionByDecimals[decimals];
  }

  onMount(() => {
    elementWidth = base.offsetWidth;
  });
</script>

<button bind:this={base} class="base" on:mousedown|self|stopPropagation>
  <div class="visible-body">
    {#if progressBar}
      <div class="progress-bar" style={`height:${(100 / diff) * value - 8}%`}></div>
    {/if}
    <div class="thumb-tab" aria-hidden={true}>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
      <div class="vertical-line"></div>
    </div>
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
  button {
    pointer-events: auto;
    background: transparent;
    border: none;
    height: 42px;
    display: flex;
  }
  .visible-body {
    position: absolute;
    /* top: 5px;
    bottom: 5px; */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 8px;
    /* background: linear-gradient(to right, #ccc, #eee, #ccc); */
    background: #eee;
    box-shadow: inset 0 1px 3px #999;
    /* box-shadow: 0 0 4px #000; */
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .thumb-tab {
    height: 100%;
    width: 100%;
    position: relative;
    margin: auto;
    display: flex;
    justify-content: center;
    gap: 2px;
    padding: 4px 0;
    opacity: 0.9;
  }
  .thumb-tab div:nth-child(1), .thumb-tab div:nth-child(9) {
    opacity: 0.1;
  }
  .thumb-tab div:nth-child(2), .thumb-tab div:nth-child(8) {
    opacity: 0.2;
  }
  .thumb-tab div:nth-child(3), .thumb-tab div:nth-child(7) {
    opacity: 0.3;
  }
  .thumb-tab div:nth-child(4), .thumb-tab div:nth-child(6) {
    opacity: 0.4;
  }
  .thumb-tab div:nth-child(5) {
    opacity: 0.5;
  }
  .vertical-line {
    background: #888;
    width: 4px;
    height: 100%;
    border-radius: 2px;
  }
  .base {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 12fr 1fr;
    justify-content: space-between;
    /* width: calc(100% + 1rem); */
    /* width: 100%; */
    /* margin: 1rem 0 1rem -0.5rem; */
    margin: 1rem 0;
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
    opacity: 0.5;
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .minus {
    /* justify-self: flex-start; */
    padding-bottom: 3px;
    font-size: 1.5rem;
  }
  .plus {
    padding-bottom: 5px;
    font-size: 1.7rem;
    font-weight: 300;
    /* justify-self: flex-end; */
  }
  .slider {
    opacity: 0;
    width: 100%;
  }
</style>