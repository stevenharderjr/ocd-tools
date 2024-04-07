<script lang="ts">
	import { round, type Precision } from '$lib/utils/round';
	import { createEventDispatcher, onMount } from 'svelte';
	import { precisionByDecimals } from './utils/MeasurementConverter';
	const dispatch = createEventDispatcher();

	let elementWidth = 100;

	export let sensitivity = [1, 1];
	export let primaryAxis = 0;
	let base: HTMLButtonElement;
	let slider;
	let origin: [number, number];
	let h = 0;
	let v = 0;
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
		direction = 0;
		dispatch('reset', [h, v]);
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
		dispatch('reset', [h, v]);
	}

	function handleTouchMove(event: TouchEvent) {
		if (verticalTouchMove) return;
		const [{ clientX: x, clientY: y }] = event.touches;
		const [originX, originY] = origin as [number, number];
		const [h, v] = sensitivity;
		const deltaH = (x - originX) / h;
		const deltaV = (y - originY) / v;

		// try to prevent horizontal input from interfering with vertical scrolling
		if (!horizontalTouchMove && Math.abs(deltaV) > Math.abs(deltaH))
			return (verticalTouchMove = true);

		horizontalTouchMove = true;
		event.stopPropagation();
		event.preventDefault();

		dispatch('change', [deltaH, deltaV]);
	}

	function handleDrag(event: DragEvent) {
		const { screenX: x, screenY: y } = event;
		if (x < 1) return;

		const [h, v] = sensitivity;
		const [originX, originY] = origin;
		const deltaX = (x - originX) / h;
		const deltaY = (y - originY) / v;

		dispatch('change', [deltaX, deltaY]);
	}

	function increment() {
		const [h, v] = sensitivity;
		const delta = primaryAxis === 0 ? [h, 0] : [0, v];
		dispatch('change', delta);
	}

	function decrement() {
		const [h, v] = sensitivity;
		const delta = primaryAxis === 0 ? [h, 0] : [0, v];
		dispatch('change', delta);
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
	<button class="minus" on:click|stopPropagation={decrement}> – </button>
	<button
		bind:this={slider}
		class="slider"
		on:dragstart={dragStart}
		on:touchstart={touchStart}
		on:drag={handleDrag}
		on:touchend={touchEnd}
		on:touchmove={handleTouchMove}
		on:dragend={dragEnd}
		on:click|stopPropagation
		draggable={true}
	>
	</button>
	<button class="plus" on:click|stopPropagation={increment}> + </button>
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
	.thumb-tab div:nth-child(1),
	.thumb-tab div:nth-child(9) {
		opacity: 0.1;
	}
	.thumb-tab div:nth-child(2),
	.thumb-tab div:nth-child(8) {
		opacity: 0.2;
	}
	.thumb-tab div:nth-child(3),
	.thumb-tab div:nth-child(7) {
		opacity: 0.3;
	}
	.thumb-tab div:nth-child(4),
	.thumb-tab div:nth-child(6) {
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
	.plus,
	.minus {
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
