<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { blur } from '../stores';
	const dispatch = createEventDispatcher();

	export let title = '';
	export let question = 'Are you sure?';
  const split = question.split('"');

	function confirm() {
		dispatch('confirm');
	}

	function reject() {
		dispatch('reject');
	}

	onMount(() => ($blur = true));
	onDestroy(() => ($blur = false));
</script>

<div class="backdrop" on:click|self={reject} aria-hidden={true}>
	<div class="container">
		{#if title}
			<h2 class="title">{title}</h2>
		{/if}
		{#if question}
			<p class="description">
        {#if split.length > 2}
          {split[0]}<strong>{split[1]}</strong>{split[2]}
        {:else}
				  {question}
        {/if}
			</p>
		{/if}
		<div class="buttons">
			<button class="reject" on:click={reject}>
				<img src="x-circle.svg" alt="reject" />
				Cancel
			</button>
			<button class="confirm" on:click={confirm}>
				<img src="check-circle.svg" alt="confirm" />
				Confirm
			</button>
		</div>
	</div>
</div>

<style>
	.backdrop {
		z-index: 5;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.container {
		width: 20rem;
		max-width: 92vw;
		height: fit-content;
		background: #000b;
		border-radius: 8px;
		backdrop-filter: blur(8px);
		color: #fff;
		padding: 1rem;
	}
	.description {
		font-size: 1rem;
    hyphens: auto;
	}
	.buttons {
		display: flex;
		flex-direction: row-reverse;
		justify-content: stretch;
		align-items: center;
		gap: 1rem;
		min-width: 50%;
		margin-top: 1rem;
	}
	button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 4px;
		background: #fffc;
		min-width: 5rem;
		/* height: 42px; */
		font-size: small;
		font-weight: 500;
		text-transform: uppercase;
		color: #000;
		padding: 0.5rem 1rem 0.5rem 0.5rem;
		width: 100%;
	}
	img {
		margin-right: 0.25rem;
	}
	/* span {
  } */
</style>
