<script lang="ts">
	import { browser } from '$app/environment';
	import Toast from '../../toast';
	import BinarySelect from '$lib/BinarySelect.svelte';
	import LayoutPrecision from './LayoutPrecision.svelte';
	import type { ToggleOption } from '$lib/BinarySelect.svelte';
	import type AlignmentOptions from '$lib/BinarySelect.svelte';
	import { sae, measurement, type Measurement } from '$lib/utils/MeasurementConverter';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let points: number[];
	export let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64 = 8;
	export let dynamicPrecision;
	export let alignment: 'even' | 'simple' = 'even';

	const alignmentOptions: [ToggleOption, ToggleOption] = [
		{
			label: 'Even',
			value: 'even'
		},
		{
			label: 'Basic',
			value: 'basic'
		}
	];

	function placeholder(message?: string) {
		console.log('clipboard clicked');
		Toast.add({
			message: 'COMING SOON:\n' + message,
			duration: 5000
		});
	}

	function handleCopy() {
		dispatch('copy', { ...displayOptions });
	}

	$: pointCount = points.length;
	$: displayOptions = { precision };
	$: measurements = points.map((point) => measurement(point, displayOptions)) as Measurement[];
</script>

<div class="row">
	<!-- <span class="small-caps">Measurements ({pointCount})</span> -->
	<h2>Measurements ({pointCount})</h2>
	<button on:click|stopPropagation={handleCopy} title="add new layout">
		{#if browser && navigator.canShare?.()}
			<img class="iOS" src="share.svg" alt="share" />
			<img class="android" src="share-2.svg" alt="share" />
		{:else}
			<img src="copy.svg" alt="stacked squares" />
		{/if}
	</button>
</div>
<!-- <div class="breakout"> -->
<LayoutPrecision {precision} {dynamicPrecision} on:update />
<!-- </div> -->
<ul>
	{#each measurements as measurement, i}
		<li>
			<label for={`point ${i}`}>
				<input id={`point ${i}`} type="checkbox" />
				{#if !measurement.readable}
					{'0"'}
				{:else if measurement.feet}
					{measurement.feet}' {measurement.fraction
						? measurement.inches + ' ' + measurement.fraction
						: measurement.inches}"
				{:else}
					{measurement.fraction
						? measurement.inches + ' ' + measurement.fraction
						: measurement.inches}"
				{/if}
			</label>
		</li>
	{/each}
</ul>
<div class="options">
	<BinarySelect
		id="alignment"
		options={alignmentOptions}
		selected={alignment}
		orientation="horizontal"
		on:update
	/>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}
	ul {
		width: 100%;
		pointer-events: auto;
		list-style: none;
		display: grid;
		column-gap: 2rem;
		grid-template-columns: 2fr 1fr;
		justify-self: center;
	}
	label {
		display: flex;
		align-items: center;
		white-space: nowrap;
		height: 42px;
		border-radius: 8px;
		font-size: 0.9rem;
		text-indent: 6px;
	}
	span {
		white-space: nowrap;
	}
	.small-caps {
		text-align: center;
		margin-bottom: -4px;
		/* font-size: 0.9rem;
    letter-spacing: 1.5px; */
	}
	.breakout {
		width: calc(100% + 1rem);
		margin: 1rem 0 1.5rem -0.5rem;
	}
	.options {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 0.5rem;
	}
	button {
		pointer-events: auto;
		height: 42px;
		width: 42px;
		border-radius: 8px;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: -0.5rem;
	}
	button img {
		opacity: 0.6;
		height: 1.3rem;
		width: 1.3rem;
	}
	.iOS {
		display: none;
	}
	@media screen and (-webkit-min-device-pixel-ratio: 0) {
		/* Safari and Chrome, if Chrome rule needed */
		.iOS {
			display: inline;
		}
		.android {
			display: none;
		}
	}
</style>
