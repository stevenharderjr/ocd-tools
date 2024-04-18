<script lang="ts">
	import CalculatorButton from '$lib/CalculatorButton.svelte';
	export let buttons: App.Button[] = [];
</script>

<div class="calculator-buttons">
	{#each buttons as button}
		<CalculatorButton {button} on:click />
	{/each}
</div>

<style>
	.calculator-buttons {
		display: grid;
		align-self: flex-end;
		justify-items: center;
		align-self: center;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		pointer-events: none;
		max-width: 100%;
		width: 100%;
	}
</style>
