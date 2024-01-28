<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import EditFactor from './EditFactor.svelte';
	import { newFactor } from '../../stores';
  import { invalidate } from '$lib/utils/tester';
	import Toast from '../../toast';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
  const defaultLabel = ratio.label || '';
  let container: HTMLLIElement;
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

<li bind:this={container} class="floating inline-modal">
	<button class="touchable" on:click|stopPropagation>
		<section class="edit-header">
			<input
				bind:this={labelInput}
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
		</section>

		<section class="edit factors">
			{#each ratio.factors as factor}
				<EditFactor {factor} on:update on:add={addFactor} on:save={saveChanges} />
			{/each}
			{#if !partialFactor}
				<button class="add-factor" on:click|stopPropagation={addFactor} title={'add factor to "' + name + '"'}>
					+ New Factor
				</button>
			{/if}
		</section>

		{#if ratio.factors.length > 1}
			<div class="edit-actions">
				<button on:click|stopPropagation={selfDestruct} title="delete this ratio">
					<img src="trash-2.svg" alt="trashcan" />
				</button>
				<button on:click|stopPropagation={handleReset} title="reset changes">
					<img src="rotate-ccw.svg" alt="arrow rotating counter-clockwise" style="margin-left:2px;" />
				</button>
				<!-- <button class="edit-action" on:click|stopPropagation={toggleEdit}> CANCEL </button> -->
				<button
					class="save-action"
					on:click|stopPropagation={saveChanges}
					title="save updates and return to overview"
				>
					<img src="check-circle.svg" alt="check-circle" />
					<span class="action-label">SAVE</span>
				</button>
			</div>
		{/if}
	</button>

	<div class="modal-options">
		<button
			on:click|stopPropagation={handleClose}
			title="discard all changes and return to overview"
		>
			<img src="x.svg" alt="x" />
		</button>
	</div>
</li>

<style>
  input {
		font-size: 1.25rem;
		font-weight: 500;
		flex: 1;
		max-width: 14rem;
	}
	input:focus {
		padding: 4px 8px;
	}

	.inline-modal {
    z-index: 5;
    pointer-events: auto;
    scroll-margin-top: 20vh;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		border-radius: 8px;
		margin-bottom: 1rem;
		background: #fff;
		width: 100%;
		padding: 0.25rem;
	}

	.edit-header {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
    align-self: flex-start;
	}

	.edit-header input {
		max-height: 2rem;
    max-width: 85%;
	}

	.edit-header input:focus {
		padding-left: 6px;
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

	.edit-actions img {
		filter: invert(1);
		opacity: 0.95;
		height: 4.5mm;
		width: 4.5mm;
		/* padding-left: 3px; */
	}

	.edit-actions button {
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
