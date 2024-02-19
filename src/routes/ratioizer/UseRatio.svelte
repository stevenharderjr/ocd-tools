<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Slider from './Slider.svelte';
	import InvisibleSlider from '$lib/InvisibleSlider.svelte';
	import Factor from './Factor.svelte';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
  let container: HTMLLIElement;
	let factors: App.Factor[] = [];
	let precision = '1';
	const initial = ratio.factors;
	const baselineIndex = initial.length - 1;
	// value of last entry should be smallest, so
	const baselineFactor: App.Factor = initial[baselineIndex];
	let { prefix, suffix } = baselineFactor;
	let total = '';
	let locked = true;
	let valueMap: Map<string, number> = new Map();

	initialize();

	$: decimals = precision.length - 1;
	$: currentBaseline = { ...(factors[baselineIndex]), label: '' };

	const decreaseRate = 0.75;
	const increaseRate = 1.25;

	function getUsableRangeFromValue(value: number) {
		const min = Math.max(1, Math.round(value * 0.125));
		let max = Math.max(min + 10, Math.round(value * 1.875));
		return [min, max];
	}

	function initialize() {
		let sum = 0;
		valueMap = new Map(
			initial.map((factor) => {
				const { id, name, value, prefix: factorPrefix, suffix: factorSuffix, precision: factorPrecision } = factor;
				if (factorPrecision && +precision < +factorPrecision) precision = factorPrecision;

				if (!prefix || (prefix !== factorPrefix)) prefix = '';
				if (!suffix || (suffix !== factorSuffix)) suffix = '';

				const [min, max] = getUsableRangeFromValue(value);

				factors.push({ ...factor, min, max, value, baseline: value });
				sum += +value;

				return [id, value];
			})
		);
		total = sum.toFixed(decimals);
	}

	function updateValues({ id, value: targetValue }: { id: string; value: number }, updateRanges = false) {
		const conversionRate = targetValue / (valueMap.get(id) as number);
		let sum = 0, factorIndex = 0;
		const update = [];
		for (const factor of factors) {
			const staticFactor = initial[factorIndex++];
			const value = +(staticFactor.value * conversionRate).toFixed(decimals);
			if (value < 1 / +precision) return;
			sum += value;

			if (updateRanges) {
				const [min, max] = getUsableRangeFromValue(value);
				update.push({ ...factor, value, min, max });
			}
			else update.push({ ...factor, value });
		}
		factors = update;
		total = sum.toFixed(decimals);
	}

	function resetValues(payload) {
		updateValues(payload?.detail?.id ? payload.detail : baselineFactor, true);
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

		value = +value.toFixed(decimals);

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

  onMount(() => {
		container.scrollIntoView({ behavior: 'smooth' });
	});
</script>

<li bind:this={container} class="floating inline-modal">
	<button class="touchable" on:click={close} on:keypress={handleKeyboardCancel}>
		<div class="modal-header">
			<h2>{ratio.label}</h2>
			<span>({prefix + total + suffix})</span>
		</div>
		<div class="factors">
			{#each factors as factor}
				{#if locked}
					<Factor {factor} {precision} />
				{:else}
					<!-- <Slider {factor} {precision} on:update={handleSliderInput} /> -->
					<InvisibleSlider id={factor.id} value={factor.value} min={factor.min} max={factor.max} baseline={factor.baseline} label={factor.label} prefix={factor.prefix} suffix={factor.suffix} on:update={handleSliderInput} on:reset={resetValues} />
				{/if}
			{/each}
			{#if locked}
					<!-- <Slider	factor={currentBaseline} {precision} on:update={handleSliderInput} /> -->
					<InvisibleSlider id={currentBaseline.id} value={currentBaseline.value} min={currentBaseline.min} max={currentBaseline.max} baseline={currentBaseline.baseline} on:update={handleSliderInput} on:reset={resetValues} />
			{/if}
		</div>

		<button class="modal-actions" on:click|stopPropagation>
			<!-- <button on:click|stopPropagation={decrease} title="halve"> ½ </button> -->
			<button on:click|stopPropagation={decrease} title="halve">
				<img height="16px" width="16px"src="minus.svg" alt="subtraction symbol" />
			</button>
			<button on:click|stopPropagation={resetValues} title="restore initial values">
				<img height="16px" width="16px"src="rotate-ccw.svg" alt="arrow indicating a counterclockwise circle" />
			</button>
			<button on:click|stopPropagation={increase} style="font-size:small;" title="double">
				<img height="16px" width="16px"src="plus.svg" alt="addition symbol" />
			</button>
		</button>

		<div class="modal-options">
			<button
				on:click|stopPropagation={toggleLock}
				title={locked ? 'locked for precision' : 'unlocked for variability'}
			>
				{#if locked}
					<img height="16px" width="16px"src="lock.svg" alt="locked padlock" style="position:relative;top:-1px;" />
				{:else}
					<img height="16px" width="16px"src="unlock.svg" alt="unlocked padlock" style="position:relative;top:-1px;" />
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
