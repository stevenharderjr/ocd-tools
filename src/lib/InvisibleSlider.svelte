<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let value: number;
  // export let decimals: number;
  export let min: number;
  export let max: number;
  $: rate = 1 / (innerWidth / (max - min)) * 4;

  let slider;
  let origin: number | [number, number];
  let direction = 0;
  // let end: [number, number];
  let innerWidth: number;
  let horizontalTouchMove = false;
  let verticalTouchMove = false;

  function dragStart(event: DragEvent) {
    // slider.style.visibility = 'hidden';
    const { screenX: x, screenY: y } = event;
    origin = x;
  }

  function dragEnd(event: DragEvent) {
    // slider.style.visibility = 'visible';
    const [{ screenX: x, screenY: y }] = event.touches;
    direction = 0;
  }

  function touchStart(event: TouchEvent) {
    const [{ clientX: x, clientY: y }] = event.touches;
    origin = [x, y];
    direction = 0;
    console.log('start', [x, y]);
  }

  function touchEnd(event: TouchEvent) {
    // const [{ clientX: x, clientY: y }] = event.touches;
    console.log('end', event);
    direction = 0;
    horizontalTouchMove = false;
    verticalTouchMove = false;
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

    dispatch('change', { value: newValue });
  }

  // function handleTouchDrag(event: TouchEvent) {
  //   const { x, y } = event;
  // }

  function handleDrag(event: DragEvent) {
    const { screenX: x, screenY: y } = event;
    if (x < 1) return;
    const change = ~~((x - (origin as number)) * rate);
    let newValue = value + change;
    if (newValue === value) return;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    if ((newValue > value && direction < 1) || (newValue < value && direction > -1)) origin = x;

    dispatch('change', { value: newValue });
  }

  function increment() {
    if (value < max) dispatch('change', { value: value + 1 });
  }

  function decrement() {
    if (value > min) dispatch('change', { value: value - 1 });
  }
</script>

<svelte:window bind:innerWidth />

<button class="base" on:mousedown|self|stopPropagation>
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
    justify-content: space-between;
  }
  .base {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    background: #eee;
    border-radius: 24px;
    background: linear-gradient(to right, #ddd, #eee, #eee, #ddd);
  }
  .plus, .minus {
    position: relative;
    line-height: 42px;
    opacity: 0.5;
    width: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .minus {
    top: -1px;
    font-size: 1.5rem;
    /* font-weight: 50; */
    border-radius: 50% 0 0 50%;
  }
  .plus {
    top: -2px;
    font-size: 1.7rem;
    font-weight: 300;
    border-radius: 0 50% 50% 0;
  }
  .slider {
    opacity: 0;
    background: transparent;
  }
</style>