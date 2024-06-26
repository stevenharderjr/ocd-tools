<script context="module" lang="ts">
	export interface ToggleOption {
		label: string;
		value: any;
	}
</script>

<script lang="ts">
	import { precisionByDecimals } from '$lib/utils/MeasurementConverter';
	import type { MeasurementPrecision } from '$lib/utils/MeasurementConverter';
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let precision: MeasurementPrecision;
	export let dynamicPrecision: MeasurementPrecision;
	export let shrink = false;
	let selectedElement: HTMLButtonElement;
	let dummyElement: HTMLButtonElement;

	const options = [
		{ label: '1', value: 1 },
		{ label: '1/2', value: 2 },
		{ label: '1/4', value: 4 },
		{ label: '1/8', value: 8 },
		{ label: '1/16', value: 16 }
	];

	const html = Object.fromEntries(
		options.map(({ label }) => {
			const [numerator, denominator] = label.split('/');
			return [label, { numerator, denominator }];
		})
	);

	function handleChange(key: string) {
		const selectedOption = options.find(({ label }) => label === key);
		if (!selectedOption || selectedOption.value === precision) return;
		dispatch('update', { id: 'precision', value: selectedOption.value });
	}

	onMount(() => {
		selectedElement.scrollIntoView();
	});
</script>

<div>
	<span class="small-caps">Precision</span>
	<div class="base" style={shrink ? 'height: fit-content;' : ''}>
		{#each options as option}
			{#if option.value === dynamicPrecision}
				<button
					bind:this={selectedElement}
					class="option dynamic"
					on:click={() => handleChange(option.label)}
				>
					{#if html[option.label].denominator}
						<sup>{html[option.label].numerator}</sup>⁄<sub>{html[option.label].denominator}</sub>"
					{:else}
						{option.label}
					{/if}
				</button>
			{:else if option.value === precision}
				<button
					bind:this={selectedElement}
					class="option selected"
					on:click={() => handleChange(option.label)}
				>
					{#if html[option.label].denominator}
						<sup>{html[option.label].numerator}</sup>⁄<sub>{html[option.label].denominator}</sub>"
					{:else}
						{option.label}
					{/if}</button
				>
			{:else}
				<button class="option" on:click={() => handleChange(option.label)}>
					{#if html[option.label].denominator}
						<sup>{html[option.label].numerator}</sup>⁄<sub>{html[option.label].denominator}</sub>"
					{:else}
						{option.label}
					{/if}</button
				>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* span {
    margin-bottom: -20px;
  } */
	.small-caps {
		width: 100%;
		margin-bottom: -4px;
		text-align: center;
	}
	.base {
		/* border: 2px solid #ccc; */
		border: none;
		box-shadow: inset 0 1px 3px #999;
		display: flex;
		background: #eee;
		border-radius: 8px;
		padding: 4px;
		justify-content: flex-start;
		align-items: center;
		height: 42px;
		overflow-x: scroll;
		width: 100%;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.base::-webkit-scrollbar {
		display: none;
	}
	.option {
		min-width: 42px;
		height: 100%;
		text-transform: uppercase;
		border-radius: 5px;
		text-align: center;
		font-weight: 100;
		font-size: small;
		color: #888;
		border: 1.5px solid transparent;
		padding: 0 1px;
	}
	.selected,
	.dynamic {
		padding: 0 2px;
		border: none;
		font-weight: 500;
		color: #000;
		background: #fff;
		box-shadow: 0 1px 4px #0006;
	}
	.dynamic {
		background: #666;
		color: #fff;
	}
	button {
		width: 100%;
		height: 100%;
		pointer-events: auto;
		border: none;
	}
</style>
