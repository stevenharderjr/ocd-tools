<script context="module" lang="ts">
	export interface ToggleOption {
		label: string;
		value: any;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let id: string;
	export let options: ToggleOption[];
	export let selected: any;
	export let alignment = 'horizontal';
	export let inverted = false;

	function handleChange(key: string) {
		const selectedOption = options.find(({ label }) => label === key);
		// if (!selectedOption || selectedOption.value === selected) return;
		dispatch('change', { id, value: selectedOption.value });
	}
</script>

<ul class={alignment + ' base' + (inverted ? ' inverted' : '')}>
	{#each options as option}
		<li
			class={(selected === option.value ? 'option selected' : 'option') +
				(inverted ? ' inverted' : '')}
		>
			<button on:click={() => handleChange(option.label)}>{option.label}</button>
		</li>
	{/each}
</ul>

<style>
	.base {
		/* border: 2px solid #ccc; */
		border: none;
		box-shadow: inset 0 1px 3px #999;
		display: flex;
		background: #ccc;
		border-radius: 8px;
		padding: 4px;
		justify-content: center;
		align-items: center;
		align-self: center;
		justify-self: center;
		pointer-events: auto;
		list-style-type: none;
		min-height: 100%;
		min-width: 100%;
		height: 100%;
	}
	.inverted {
		filter: invert(0.6);
	}
	.vertical {
		flex-direction: column;
	}
	.horizontal {
		flex-direction: row;
	}
	.option {
		width: 100%;
		height: 100%;
		text-transform: uppercase;
		border-radius: 5px;
		/* padding: 1px 6px; */
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 100;
		font-size: 2rem;
		color: #fff;
		border: 1.5px solid transparent;
		min-width: 42px;
		min-height: 42px;
	}
	.selected {
		/* padding: 1px 6.5px; */
		border: none;
		font-weight: 500;
		color: #000;
		background: #fff;
		box-shadow: 0 1px 4px #0006;
	}
</style>
