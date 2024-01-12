<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Slider from '$lib/Slider.svelte';
	import Factor from './Factor.svelte';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
  let container: HTMLDivElement;
	let factors: App.Factor[] = [];
	let relativeRange = [0.125, 1.875];
	let lowFactor,
		floorId: string,
    floorName: string,
		floorValue: number,
		maxId: string,
		maxValue: number;
	let total = 0;
	let locked = true;
	let valueMap: Map<string, number> = new Map(
		ratio.factors.map((factor) => {
			const { id, name, value } = factor;
			factors.push(factor);
			total += +value;
			if (!maxValue || value > maxValue) {
				maxValue = value;
				maxId = id;
			}
			if (!floorValue || value < floorValue) {
				lowFactor = { ...factor };
				floorId = id;
				floorValue = value;
        floorName = name || '';
			}
			return [id, value];
		})
	);
	updateRange(floorValue!);

	function updateRange(floor?: number) {
		const staticFloor = valueMap.get(floorId) as number;
		const conversion = (floor || staticFloor) / staticFloor;
		relativeRange = [+(conversion * 0.125).toPrecision(3), +(conversion * 1.875).toPrecision(3)];
	}

	function updateValues({ id, value: targetValue }: { id: string; value: number }) {
		const conversionRate = targetValue / (valueMap.get(id) as number);
		let min: number,
			max: number,
			sum = 0;
		const refactor = factors.map((factor, i) => {
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
    // return dispatch('reset');
		let sum = 0;
		factors = factors.map((factor, i) => {
			const value = ratio.factors[i].value;
			sum += value;
			return { ...factor, value };
		});
		floorValue = valueMap.get(floorId) as number;
		maxValue = valueMap.get(maxId) as number;
		total = sum;
		updateRange(floorValue);
	}

	function half() {
		let value = floorValue * 0.5;
		if (value < 1) return;

		updateRange(value);

		value = Math.round(value);
		floorValue = value;

		updateValues({ id: floorId, value });
	}

	function double() {
		let value = floorValue * 2;

		updateRange(value);
		value = Math.round(value);
		floorValue = value;

		updateValues({ id: floorId, value });
	}

	function handleSliderInput({ detail }) {
		updateValues(detail);
	}

	function close() {
		// restore stored values
		dispatch('close');
	}

  function handleKeyboardCancel({ key }: KeyboardEvent) {
    if (key === 'esc') close();
  }

	function toggleLock() {
		locked = !locked;
		if (locked) updateValues({ id: floorId, value: floorValue });
    // updateRange(floorValue);
	}

  onMount(() => container.scrollIntoView({ behavior: 'smooth' }));
</script>

<div bind:this={container} class="floating container" on:click|self={close} on:keypress={handleKeyboardCancel} role="combobox" aria-expanded={true} tabindex={-1}>
<!-- <div class="floating container"> -->
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
      <Slider
        factor={{ id: floorId, value: floorValue }}
        {relativeRange}
        on:update={handleSliderInput}
      />
    {/if}
	</div>
	<button class="shortcuts" on:click|stopPropagation>
		<button class="shortcut" on:click|stopPropagation={half} title="halve"> ½ </button>
		<button class="shortcut" on:click|stopPropagation={resetValues} title="restore initial values">
			<img
				class="shortcut-icon"
				src="rotate-ccw.svg"
				alt="arrow indicating a counterclockwise circle"
			/>
		</button>
		<button class="shortcut" on:click|stopPropagation={double} style="font-size:small;" title="double"> ×2 </button>
	</button>
	<div class="options">
		<!-- <button
			class="option-button"
			on:click={close}
			title="stop using ratio and return to overview"
		>
			<img src="x.svg" alt="x" />
		</button> -->
		<button
			class="option-button"
			on:click|stopPropagation={toggleLock}
			title={locked ? 'locked for precision' : 'unlocked for variability'}
		>
			{#if locked}
				<img src="lock.svg" alt="locked padlock" style="position:relative;top:-1px;" />
			{:else}
				<img src="unlock.svg" alt="unlocked padlock" style="position:relative;top:-1px;" />
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
  span {
		font-size: 1rem;
		padding-left: 0.5rem;
	}
	.container {
    z-index: 5;
    pointer-events: auto;
    scroll-margin-top: 20vh;
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #fff;
		border-radius: 8px;
		padding: 10px 14px;
		margin-bottom: 1rem;
	}
	.factors {
    position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0.5rem;
	}
	.title-bar {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: baseline;
    border: none;
    background: none;
	}
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
	}
	.options {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		top: 0;
		right: 0;
		pointer-events: auto;
    margin: 1px;
	}
	.shortcuts {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
		padding: 0.25rem 0;
    border: none;
    background: none;
	}
	.shortcut {
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
