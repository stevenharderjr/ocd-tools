<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import EditFactor from '$lib/EditFactor.svelte';
	import { newFactor } from '../stores';
	import Toast from '../toast';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
	let edit = { ...ratio };
	let factors = [...edit.factors].sort(descendingValue);

	// const { name } = edit;
	let partialFactor: App.FactorFlag;
	let currentLabel = edit.label;
	let labelInput: HTMLInputElement;

	export let locked = true;

	function descendingValue({ value: a }: App.Factor, { value: b }: App.Factor) {
		return a > b ? -1 : a < b ? 1 : 0;
	}

	function handleBlur({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const { value: inputValue, name: key } = currentTarget;
		if (currentLabel && !inputValue) currentTarget.value = currentLabel;
	}

	function handleFocus({ currentTarget }: { currentTarget: HTMLInputElement }) {
		currentTarget.value = '';
	}

	function handleRename({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const { value } = currentTarget;
		if (!value) return;
		currentTarget.blur();
	}

	function updateFactor({ detail: update }: { detail: App.Factor }) {
    const updateId = update.id;
    if (update.softDelete && !update.label) {
      factors = factors.filter(({ id }) => id !== updateId);
      return;
    }
		if (!update.label) {
			if (update.softDelete && !update.name) return cancelPartialFactor();
			factors = factors.map((factor) => (factor.name === update.name ? update : factor));
		} else {
			if (update.value) partialFactor = undefined;
			let rename = update.label.toLowerCase();
			if (rename === update.name) {
				// no name change, so just record other changes
				console.log('update', rename);
				factors = factors.map((factor) => (factor.name === rename ? update : factor));
			} else if (update.name) {
				// factor has been renamed
				console.log(`rename ${update.name} to ${rename}`);
				factors = factors.map((factor) =>
					factor.name === update.name ? { ...update, name: rename } : factor
				);
			} else {
				// must be a new factor
				console.log('add', rename);
				factors = [...factors, { ...update, name: rename }];
			}
		}
		return partialFactor;
	}

	function handleReset() {
    edit = { ...ratio };
		// dispatch('reset', ratio);
	}

	function applyChanges() {
		const errors = [];
		const error = { duration: 2000, type: 'error' };
		let validated = true;
		const label = labelInput?.value || currentLabel;

		if (!label) {
			validated = false;
			errors.push({ ...error, message: 'Ratio must have a name.' });
		}

		const finalFactors = factors.filter((factor) => {
			const { name, label, value, softDelete } = factor;
			if (softDelete) return false;

			if (!label) {
				validated = false;
				errors.push({ ...error, message: 'Each factor must be named.' });
			}
			if (!value) {
				validated = false;
				errors.push({ ...error, message: 'Each factor must have a value.' });
			}
			if (isNaN(value) || value < 1) {
				validated = false;
				errors.push({ ...error, message: 'Each value must be a positive number.' });
			}
			if (!name) factor.name = label.toLowerCase();
			return true;
		});

		if (!validated) return errors.forEach((error) => Toast.add(error));

		dispatch('update', { ...ratio, ...edit, label, factors: finalFactors.sort(descendingValue) });
	}

	function handleDelete({ detail: factor }: { detail: App.Factor }) {
		const { id: deleteId, label } = factor;
		if (!factorName) return cancelPartialFactor();
	}

	function cancelPartialFactor() {
    const partialId = partialFactor?.id;
		factors = factors.filter(({ id }) => id !== partialId);
		partialFactor = undefined;
	}

	function handleClose() {
		dispatch('close', ratio);
	}

	function toggleEdit() {
		if (edit) {
			cancelPartialFactor();
			return dispatch('close', ratio);
		}

		dispatch('edit', ratio);
		labelInput.focus();
	}

	function toggleRatioLock() {
		locked = !locked;
		Toast.add({ message: locked ? 'Unlocked' : 'Locked', blur: false, replace: true });
	}

	function handleSelection() {
		if (edit) return;
		// console.log('selection:', detail)
		dispatch('use', ratio);
	}

	function addFactor() {
		// Toast.add({ message: 'Should add another factor', blur: false })
    partialFactor = newFactor();
		factors = [...factors, partialFactor];
	}

	function handleKeyPress({ key }: KeyboardEvent) {
    if (key !== 'esc' && key !== 'Enter') return;
		if (key === 'esc') return toggleEdit();
    // if (edit.label) return applyChanges();
    if (edit.factors.length < 2) addFactor();
	}

	function selfDestruct() {
		dispatch('delete', ratio);
	}

	onMount(() => labelInput.focus());
</script>

<div class="floating ratio">
	<div class="label-bar">
		<input
			bind:this={labelInput}
			class="label"
			name="label"
			type="text"
			value={edit.label}
			placeholder={currentLabel || 'Ratio Name'}
			title="edit ratio name"
      autocomplete="off"
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:change={handleRename}
			on:keypress={handleKeyPress}
		/>
	</div>
	<div class="factors">
		{#each factors as factor}
			<EditFactor {factor} on:update={updateFactor} on:delete={handleDelete} on:add={addFactor} />
		{/each}
		{#if edit && !partialFactor}
			<button class="add-factor" on:click={addFactor} title={'add factor to "' + name + '"'}>
				+ New Factor
			</button>
		{/if}
	</div>
	{#if edit}
		<div class="edit-actions">
			<button class="edit-action" on:click|stopPropagation={selfDestruct} title="delete this ratio">
				<img class="inverted-icon" src="trash-2.svg" alt="trashcan" />
			</button>
			<!-- <button class="edit-action" on:click|stopPropagation={handleReset} title="reset changes">
				<img class="inverted-icon" src="rotate-ccw.svg" alt="arrow rotating counter-clockwise" style="margin-left:2px;" />
			</button> -->
			<!-- <button class="edit-action" on:click|stopPropagation={toggleEdit}> CANCEL </button> -->
			<button
				class="save-action"
				on:click|stopPropagation={applyChanges}
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
