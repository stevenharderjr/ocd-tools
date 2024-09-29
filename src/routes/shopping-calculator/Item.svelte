<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let label = '';
	export let price = 0;

	function adjustItem() {
		dispatch('tap');
	}
</script>

<div>
	<button on:click={adjustItem}>{label} ${price}</button>
</div>

<style>
	div {
		align-self: flex-end;
		min-height: 40px;
		display: flex;
		align-items: center;
	}
	button {
		font-size: 1.2rem;
		text-align: right;
	}
</style>
