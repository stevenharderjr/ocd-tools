<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import EditFactor from '$lib/EditFactor.svelte';
	import { newFactor } from '../stores';
  import { invalidate } from '$lib/utils/tester';
	import Toast from '../toast';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
  const defaultLabel = ratio.label || '';
  let container: HTMLDivElement;
	let labelInput: HTMLInputElement;
  $: partialFactor = ratio.factors.find(factor => (factor.label === ''));

	function descendingValue({ value: a }: App.Factor, { value: b }: App.Factor) {
		return a > b ? -1 : a < b ? 1 : 0;
	}

	function handleBlur({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const { value } = currentTarget;
    if (!value) currentTarget.value = defaultLabel;
	}

	function handleFocus({ currentTarget }: { currentTarget: HTMLInputElement }) {
		currentTarget.value = '';
	}

	function handleRename({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const { value } = currentTarget;
		if (!value) return;
    dispatch('rename', { ...ratio, label: value });
		currentTarget.blur();
	}

  // function deleteFactor({ detail: factor }: { detail: App.Factor }) {
  //   const deleteId = factor.id;
  //   const factors: App.Factor[] = ratio.factors;
  //   if (invalidate(factor)) return updateFactor({ detail: { ...ratio, factors: factors.filter(({ id }) => (id !== deleteId)) } });
  // }

	function saveChanges() {
		dispatch('save', { ...ratio, factors: ratio.factors.sort(descendingValue) });
	}

  function handleReset() {
    dispatch('reset', ratio);
  }

	function handleClose() {
		dispatch('close');
	}


	function addFactor() {
    if (partialFactor) return Toast.add(invalidate(partialFactor));
    dispatch('update', newFactor());
	}

	function handleKeyPress({ key }: KeyboardEvent) {
    if (key !== 'esc' && key !== 'Enter') return;
		// if (key === 'esc') return toggleEdit();
    // if (edit.label) return applyChanges();
    if (ratio.factors.length < 2) addFactor();
	}

	function selfDestruct() {
		dispatch('delete', ratio);
	}

	onMount(() => {
    container.scrollIntoView({ behavior: 'smooth' });
    labelInput.focus();
  });
</script>

<div bind:this={container} class="floating ratio">
	<div class="label-bar">
		<input
			bind:this={labelInput}
			class="label"
			name="label"
			type="text"
			value={ratio.label}
			placeholder={ratio.label || 'Ratio Name'}
			title="edit ratio name"
      autocomplete="off"
      on:change={handleRename}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:keypress={handleKeyPress}
		/>
	</div>
	<div class="factors">
		{#each ratio.factors as factor}
			<EditFactor {factor} on:update on:add={addFactor} on:save={saveChanges} />
		{/each}
		{#if !partialFactor}
			<button class="add-factor" on:click|stopPropagation={addFactor} title={'add factor to "' + name + '"'}>
				+ New Factor
			</button>
		{/if}
	</div>
	{#if ratio.factors.length > 1}
		<div class="edit-actions">
			<button class="edit-action" on:click|stopPropagation={selfDestruct} title="delete this ratio">
				<img class="inverted-icon" src="trash-2.svg" alt="trashcan" />
			</button>
			<button class="edit-action" on:click|stopPropagation={handleReset} title="reset changes">
				<img class="inverted-icon" src="rotate-ccw.svg" alt="arrow rotating counter-clockwise" style="margin-left:2px;" />
			</button>
			<!-- <button class="edit-action" on:click|stopPropagation={toggleEdit}> CANCEL </button> -->
			<button
				class="save-action"
				on:click|stopPropagation={saveChanges}
				title="save updates and return to overview"
			>
				<img class="inverted-icon" src="check-circle.svg" alt="check-circle" />
				<span class="action-label">SAVE</span>
			</button>
		</div>
	{/if}
	<div class="options">
		<button
			class="option-button"
			on:click|stopPropagation={handleClose}
			title="discard all changes and return to overview"
		>
			<img src="x.svg" alt="x" />
		</button>
	</div>
</div>

<style>
	.ratio {
    z-index: 4;
    scroll-margin-top: 20vh;
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
		padding: 0.25rem;
	}
	input {
		font-size: 1.25rem;
		font-weight: 500;
		flex: 1;
		max-width: 14rem;
	}
	input:focus {
		padding: 4px 8px;
	}
	/* img {
		height: 1.5rem;
		width: 1.5rem;
		display: flex;
		opacity: 0.5;
		border-radius: 6px;
	} */
	.option-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		border: none;
		background: transparent;
		cursor: pointer;
		opacity: 0.5;
	}
	.factors {
		margin: 0 1rem 1rem 0;
		padding-left: 1rem;
		width: 100%;
		/* background: #f006; */
	}
	.label-bar {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
    align-self: flex-start;
	}
	.options {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		top: 0;
		right: 0;
		pointer-events: auto;
	}
	.label {
		max-height: 2rem;
    max-width: 85%;
	}

	.edit-actions {
		display: flex;
		flex-direction: row;
		align-self: flex-end;
		gap: 0.5rem;
		padding: 0 0.5rem 0.5rem;
		width: 100%;
	}

	.save-action {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1.75rem 0.5rem 1rem;
		background: #666;
		color: #fff;
		font-size: 1rem;
		border: none;
		border-radius: 4px;
		width: 100%;
		flex: 1;
		font-size: small;
		font-weight: 300;
	}

	.inverted-icon {
		filter: invert(1);
		opacity: 0.95;
		height: 4.5mm;
		width: 4.5mm;
		/* padding-left: 3px; */
	}

	.edit-action {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 10mm;
		height: 10mm;
		padding: none;
		background: #666;
		/* border: 2px solid #333; */
    border: none;
		border-radius: 4px;
		/* opacity: 0.8; */
	}

	.add-factor {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
		top: 0;
		background: #fff;
		/* box-shadow: 8px 2px 8px #000; */
		border: none;
		border-radius: 6px;
		/* min-width: 7rem; */
		height: 42px;
		/* margin-bottom: 1rem; */
		width: 100%;
		font-size: 1rem;
		color: #666;
		font-weight: 500;
		font-size: small;
		text-transform: uppercase;
		text-align: center;
		padding: 4px 8px;
		/* background: #f006; */
		cursor: pointer;
	}
</style>
