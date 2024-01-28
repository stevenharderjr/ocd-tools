<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Slider from './Slider.svelte';
	import Factor from './Factor.svelte';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
  let container: HTMLLIElement;
	let factors: App.Factor[] = [];
	const initial = ratio.factors;
	const baselineIndex = initial.length - 1;
	const initialBaseline = initial[baselineIndex];
	let { prefix, suffix } = initialBaseline;
	let total = 0;
	let locked = true;
	let valueMap: Map<string, number> = new Map();

	initialize();

	$: currentBaseline = { ...(factors[baselineIndex]), label: '' };

	const decreaseRate = 0.75;
	const increaseRate = 1.25;

	function getUsableRangeFromValue(value: number) {
		return [
			Math.max(1, Math.round(value * 0.125)),
			Math.max(3, Math.round(value * 1.875))
		];
	}

	function initialize() {
		valueMap = new Map(
			initial.map((factor) => {
				const { id, name, value, prefix: factorPrefix, suffix: factorSuffix } = factor;

				if (!prefix || (prefix !== factorPrefix)) prefix = '';
				if (!suffix || (suffix !== factorSuffix)) suffix = '';

				const [min, max] = getUsableRangeFromValue(value);

				factors.push({ ...factor, min, max, value, baseline: value });
				total += +value;

				return [id, value];
			})
		);
	}

	function updateValues({ id, value: targetValue }: { id: string; value: number }, updateRanges = false) {
		const conversionRate = targetValue / (valueMap.get(id) as number);
		let sum = 0, factorIndex = 0;
		const update = [];
		for (const factor of factors) {
			const staticFactor = initial[factorIndex++];
			const value = Math.round(staticFactor.value * conversionRate);
			if (value < 1) return;
			sum += value;

			if (updateRanges) {
				const [min, max] = getUsableRangeFromValue(value);
				update.push({ ...factor, value, min, max });
			}
			else update.push({ ...factor, value });
		}
		factors = update;
		total = sum;
	}


	function resetValues() {
		updateValues(initialBaseline, true);
	}

	function decrease() {
		const { value: baselineValue, id } = currentBaseline;
		let value = Math.max(1, baselineValue * decreaseRate);

		value = Math.round(value);

		updateValues({ id, value }, true);
	}

	function increase() {
		const { value: baselineValue, id } = currentBaseline;
		let value = Math.max(2, baselineValue * increaseRate);

		value = Math.round(value);

		updateValues({ id, value }, true);
	}

	function handleSliderInput({ detail }: { detail: { id: string, value: number }}) {
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
		if (locked) updateValues(currentBaseline);
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
					<Slider {factor} on:update={handleSliderInput} />
				{/if}
			{/each}
			{#if locked}
				<Slider	factor={currentBaseline} on:update={handleSliderInput} />
			{/if}
		</div>

		<button class="modal-actions" on:click|stopPropagation>
			<!-- <button on:click|stopPropagation={decrease} title="halve"> ½ </button> -->
			<button on:click|stopPropagation={decrease} title="halve">
				<img src="minus.svg" alt="subtraction symbol" />
			</button>
			<button on:click|stopPropagation={resetValues} title="restore initial values">
				<img src="rotate-ccw.svg" alt="arrow indicating a counterclockwise circle" />
			</button>
			<button on:click|stopPropagation={increase} style="font-size:small;" title="double">
				<img src="plus.svg" alt="addition symbol" />
			</button>
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
</style>
