<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Slider from '$lib/Slider.svelte';
	import Factor from './Factor.svelte';
	import Fraction from '$lib/Fraction.svelte';
	const dispatch = createEventDispatcher();

	export let ratio = { label: '', factors: [] };
	let factors: App.Factor[] = [];
	let relativeRange = [0.125, 1.985];
	let lowFactor,
		highFactor,
		floorName: string,
		floorValue: number,
		maxName: string,
		maxValue: number;
	let total = 0;
	let locked = true;
	let valueMap: Map<string, number> = new Map(
		ratio.factors.map((factor) => {
			const { name, value } = factor;
			factors.push(factor);
			total += +value;
			if (!maxValue || value > maxValue) {
				maxValue = value;
				maxName = name;
			}
			if (!floorValue || value < floorValue) {
				lowFactor = factor;
				floorName = name;
				floorValue = value;
			}
			return [name, value];
		})
	);
	updateRange(floorValue!);

	function updateRange(floor?: number) {
		const staticFloor = valueMap.get(floorName) as number;
		const conversion = (floor || staticFloor) / staticFloor;
		relativeRange = [+(conversion * 0.125).toPrecision(3), +(conversion * 1.875).toPrecision(3)];
	}

	function updateValues({ name, value: targetValue }: { name: string; value: number }) {
		const conversionRate = targetValue / (valueMap.get(name) as number);
		let min: number,
			max: number,
			sum = 0;
		const refactor = factors.map((factor, i) => {
			const { name: factorName, value: currentValue } = factor;
			const staticFactor: App.Factor = ratio.factors[i];
			const value = Math.round(staticFactor.value * conversionRate);
			sum += value;
			if (!min || value < min) min = value;
			if (!max || value > max) max = value;
			return { ...staticFactor, value };
		});
		if (min! < 1) return;
		factors = refactor;
		floorValue = Math.round(min!);
		maxValue = max!;
		total = sum;
	}

	function resetValues() {
		let sum = 0;
		factors = factors.map((factor, i) => {
			const value = ratio.factors[i].value;
			sum += value;
			return { ...factor, value };
		});
		floorValue = valueMap.get(floorName) as number;
		maxValue = valueMap.get(maxName) as number;
		total = sum;
		updateRange();
	}

	function half() {
		let value = floorValue * 0.5;
		if (value < 1) return;

		updateRange(value);

		value = Math.round(value);
		floorValue = value;

		updateValues({ name: floorName, value });
	}

	function double() {
		let value = floorValue * 2;

		updateRange(value);
		value = Math.round(value);
		floorValue = value;

		updateValues({ name: floorName, value });
	}

	function handleSliderInput({ detail }) {
		updateValues(detail);
	}

	function close() {
		// restore stored values
		dispatch('close');
	}

	function toggleLock() {
		locked = !locked;
		if (locked) updateValues({ name: floorName, value: floorValue });
	}
</script>

<div class="floating container">
	<div class="title-bar">
		<h2>{ratio.label}</h2>
		<span>({Math.round(total)} g)</span>
	</div>
	<div class="factors">
		{#each factors as factor}
			{#if locked}
				<Factor {factor} />
			{:else}
				<Slider {factor} {relativeRange} on:update={handleSliderInput} />
			{/if}
		{/each}
    {#if locked}
    <div class="factors"></div>
      <Slider
        factor={{ name: floorName, value: floorValue }}
        {relativeRange}
        on:update={handleSliderInput}
      />
    {/if}
	</div>
	<div class="shortcuts">
		<button class="shortcut" on:click={half} title="halve"> ½ </button>
		<button class="shortcut" on:click={resetValues} title="restore initial values">
			<img
				class="shortcut-icon"
				src="rotate-ccw.svg"
				alt="arrow indicating a counterclockwise circle"
			/>
		</button>
		<button class="shortcut" on:click={double} style="font-size:small;" title="double"> ×2 </button>
	</div>
	<div class="options">
		<button
			class="option-button"
			on:click={close}
			title="stop using ratio and return to overview"
		>
			<img src="x.svg" alt="x" />
		</button>
		<button
			class="option-button"
			on:click={toggleLock}
			title={locked ? 'locked for precision' : 'unlocked for variability'}
		>
			{#if locked}
				<img src="lock.svg" alt="locked padlock" style="position:relative;top:-2px;" />
			{:else}
				<img src="unlock.svg" alt="unlocked padlock" style="position:relative;top:-2px;" />
			{/if}
		</button>
	</div>
</div>

<style>
	h2 {
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 20rem;
		max-width: 100%;
		background: #fff;
		border-radius: 8px;
		padding: 10px 14px;
		margin-bottom: 1rem;
	}
	.factors {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0.75rem 1rem 0.5rem;
	}
	.title-bar {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		/* align-items: center; */
		/* margin-bottom: 2rem; */
	}
	span {
		font-size: 1rem;
		padding-left: 0.5rem;
	}
	.x-button {
		width: 1.5rem;
		height: 1.5rem;
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		touch-action: manipulation;
		pointer-events: auto;
		top: 0.5rem;
		right: 0.5rem;
		cursor: pointer;
	}

	svg {
		width: 100%;
		height: 100%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #666;
	}

	/* img {
		height: 1.5rem;
		width: 1.5rem;
		display: flex;
		border-radius: 6px;
	} */

	.option-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		border: none;
		background: transparent;
		cursor: pointer;
		opacity: 0.5;
		/* background: #f006; */
	}
	.options {
		position: absolute;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		top: 0;
		right: 0;
		pointer-events: auto;
    margin: 1px;
	}
	.shortcuts {
		display: flex;
		flex-direction: row;
		/* justify-content: stretch; */
		gap: 0.75rem;
		margin: 0.25rem 0;
	}

	.shortcut {
		/* padding: 0.5rem 1rem; */
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10mm;
		width: 10mm;
		background: #666;
		color: #fff;
		font-size: 1rem;
		border: none;
		border-radius: 4px;
		flex: 1;
	}

	.shortcut-icon {
		filter: invert(1);
		opacity: 0.95;
		height: 5mm;
		width: 5mm;
		padding-left: 3px;
	}
</style>
