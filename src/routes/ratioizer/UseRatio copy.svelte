<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Slider from './Slider.svelte';
	import Factor from './Factor.svelte';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
  let container: HTMLLIElement;
	let factors: App.Factor[] = [];
	let relativeRange = [0.125, 1.875];
	let lowFactor,
		floorId: string,
    floorName: string,
		floorValue: number,
		maxId: string,
		maxValue: number;
	const firstFactor = ratio.factors[0];
	let { prefix, suffix } = firstFactor || {};
	let total = 0;
	let locked = true;
	let valueMap: Map<string, number> = new Map(
		ratio.factors.map((factor) => {
			const { id, name, value, prefix: factorPrefix, suffix: factorSuffix } = factor;
			if (!prefix || (prefix !== factorPrefix)) prefix = '';
			if (!suffix || (suffix !== factorSuffix)) suffix = '';
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

<li bind:this={container} class="floating inline-modal">
	<button class="touchable" on:click|self={close} on:keypress={handleKeyboardCancel}>
		<div class="modal-header">
			<h2>{ratio.label}</h2>
			<span>({prefix + Math.round(total) + suffix})</span>
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

		<button class="touchable modal-actions" on:click|stopPropagation>
			<button on:click|stopPropagation={half} title="halve"> ½ </button>
			<button on:click|stopPropagation={resetValues} title="restore initial values">
				<img src="rotate-ccw.svg" alt="arrow indicating a counterclockwise circle" />
			</button>
			<button on:click|stopPropagation={double} style="font-size:small;" title="double"> ×2 </button>
		</button>

		<div class="modal-options">
			<button
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
	</button>
</li>

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
	.inline-modal {
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

	.modal-actions {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
		padding: 0.25rem 0;
    border: none;
    background: none;
	}

	.modal-actions button {
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

	.modal-actions img {
		filter: invert(1);
		opacity: 0.95;
		height: 5mm;
		width: 5mm;
		padding-left: 3px;
	}
</style>
