<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let button: App.Button;
	const { id, img, label } = button;
	const { src, alt } = img || {};

	$: highlighted = button.highlighted;
	$: inverted = button.class === 'inverted';
	$: style = button.style;

	function handleClick({ currentTarget: { id } }) {
		dispatch('click', id);
	}
</script>

<button {id} on:click={handleClick}>
	<span class={highlighted ? 'highlighted ' : inverted ? 'inverted ' : ''} {style}>
		{#if img}
			<img {src} {alt} />
		{:else}
			{label}
		{/if}
	</span>
</button>

<style>
	button {
		pointer-events: auto;
		max-width: calc(100vw / 4);
		max-height: calc(100vw / 4);
		background: none;
		border: none;
		padding: 4px;
		width: calc(var(--column-width) / 4);
		height: calc(var(--column-width) / 4);
	}

	span {
		height: 100%;
		width: 100%;
		pointer-events: auto;
		/* border-radius: 12px; */
		border-radius: 100%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		touch-action: manipulation;
		font-size: 2rem;
		box-shadow: 0 0 4px 2px #0003;
		backdrop-filter: blur(4px);
		pointer-events: auto;
	}

	img {
		height: 1.25rem;
		width: 1.25rem;
	}

	.inverted {
		background: #999;
		filter: invert(1);
	}

	.highlighted {
		background: #666;
		filter: invert(1);
	}
</style>
