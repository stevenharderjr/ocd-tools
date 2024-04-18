<script lang="ts">
	import SegmentedSelect from '$lib/SegmentedSelect.svelte';

	export let coordinates = [0, 0];
	export let selected = 16;

	$: [x, y] = coordinates;

	const options = [
		{ label: '1', value: 1 },
		{ label: '1/2', value: 2 },
		{ label: '1/4', value: 4 },
		{ label: '1/8', value: 8 },
		{ label: '1/16', value: 16 },
		{ label: '1/32', value: 32 }
		// { label: '1/64', value: 64 }
	];
</script>

<div class="container">
	<SegmentedSelect id="precision" {options} {selected} on:change />
</div>

<style>
	.container {
		height: 4rem;
		width: fit-content;
		grid-column: 1 / 5;

		width: 100%;
	}
</style>
