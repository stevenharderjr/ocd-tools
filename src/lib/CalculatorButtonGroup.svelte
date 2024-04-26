<script lang="ts">
	import CalculatorButton from '$lib/CalculatorButton.svelte';
	export let buttons: App.Button[] = [];
	export let clearMethod = '';

	const dynamic = {
		refresh: {
			id: 'refresh',
			type: 'action',
			title: 'reset/clear',
			img: { src: 'refresh.svg', alt: 'arrows turning counter clockwise' }
		},
		backspace: {
			id: 'backspace',
			type: 'action',
			title: 'backspace',
			img: { src: 'delete.svg', alt: 'backspace' }
		}
	};
</script>

<div class="calculator-buttons">
	{#each buttons as button}
		{#if clearMethod && dynamic[clearMethod] && button.id === clearMethod}
			<CalculatorButton button={clearMethod === dynamic[clearMethod]} on:click />
		{:else}
			<CalculatorButton {button} on:click />
		{/if}
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
