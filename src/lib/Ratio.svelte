<script lang="ts">
	import Factor from '$lib/Factor.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
	let factors: App.Factor[] = ratio.factors.sort(({ value: a }, { value: b }) =>
		+a > +b ? -1 : +a < +b ? 1 : 0
	);

	function use() {
		dispatch('use', ratio);
	}

	function edit() {
		dispatch('edit', ratio);
	}

	function handleKeyPress(event: KeyboardEvent) {
		const { key } = event;
		if (key === 'Space' || key === 'Enter') use();
	}
</script>

<div
	class="floating ratio"
	on:click={use}
	tabindex="0"
	role="button"
	on:keypress={handleKeyPress}
	title={'use "' + ratio.name + '"'}
>
	<div class="label-bar">
		<span class="label">{ratio.label}</span>
	</div>
	<div class="factors">
		{#each factors as factor}
			<Factor {factor} />
		{/each}
	</div>

	<div class="options">
		<button
			class="option-button"
			on:click|stopPropagation={edit}
			title={'edit "' + ratio.name + '"'}
		>
			<img src="images/edit.svg" alt="pen on paper" />
		</button>
	</div>
</div>

<style>
	.ratio {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		border-radius: 8px;
		margin-bottom: 1rem;
		background: #fff;
		width: 20rem;
		max-width: 100%;
		padding: 10px 14px;
		cursor: pointer;
	}
	img {
		height: 1.5rem;
		width: 1.5rem;
		display: flex;
		opacity: 0.5;
		border-radius: 6px;
		/* margin: 0.5rem 0.5rem 0 0; */
	}
	.option-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		border: none;
		background: transparent;
		cursor: pointer;
	}
	.factors {
		display: flex;
		flex-direction: column;
		align-self: flex-start;
		padding: 1rem 0.5rem 1rem 0.5rem;
		width: 100%;
		/* max-width: 17rem; */
		gap: 0.5rem;
		/* background: #f006; */
	}
	.label-bar {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.options {
		position: absolute;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		top: 0;
		right: 0;
		pointer-events: auto;
	}
	.label {
		max-height: 2rem;
		font-size: 1.25rem;
		font-weight: 500;
		flex: 1;
	}
</style>
