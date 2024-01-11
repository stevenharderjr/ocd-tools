<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
  import { fixes } from '$lib/utils/fixes';
	import Toast from '../toast';
	import { diff } from './utils/tester';
	const dispatch = createEventDispatcher();
	export let factor: App.Factor;
  let edits = { softDelete: false, ...factor }
  let labelInput: HTMLInputElement;
  let valueInput: HTMLInputElement;

	function handleLabelBlur({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const { value: inputValue, name: key } = currentTarget;
		const defaultValue = factor[key as keyof App.Factor];
    let override = defaultValue + '';
		if (override && !inputValue) {
      currentTarget.value = override;
    }
    edits = { ...edits, [key]: inputValue || override };
    if (diff(factor, edits)) dispatch('update', { ...factor, [key]: inputValue || override });
	}

  function handleValueBlur({ currentTarget }: { currentTarget: HTMLInputElement }) {
    const { value: inputValue } = currentTarget;
    if (!inputValue) {
      const { prefix, value, suffix } = factor;
      edits = { ...edits, prefix, value, suffix };
      currentTarget.value = prefix + value + suffix;
    }
    // dispatch('update', edits);
  }

  function handleValueInput({ currentTarget }: { currentTarget: HTMLInputElement }) {
    const inputValue = currentTarget.value;
    const { value, prefix, suffix } = fixes(inputValue);
    dispatch('update', { ...factor, prefix, value, suffix });
    const string = prefix + value + suffix;
    if (string !== inputValue) currentTarget.value = string;
  }

	function handleFocus({ currentTarget }: { currentTarget: HTMLInputElement }) {
		currentTarget.value = '';
	}

	// function handleEdits({ currentTarget: { value: inputValue, name: key } }: { currentTarget: HTMLInputElement | { value: string | number | boolean, name: keyof App.Factor }}) {
	// 	if (!inputValue && inputValue !== false) return;
	// 	if (key === 'value') inputValue = +inputValue;
	// 	edits = {
	// 		...edits,
	// 		[key]: inputValue || inputValue === false ? inputValue : factor[key as keyof App.Factor]
	// 	};
	// 	// dispatch('update', payload);
	// }

	function toggleSoftDelete() {
		// handleEdits({ currentTarget: { value: !edits.softDelete, name: 'softDelete' } });
    const softDelete = !factor.softDelete;
    // if (factor.label) Toast.add({ message: `${factor.label} should be ${softDelete ? 'crossed out' : 'restored'}`, blur: false });
    dispatch('update', { ...factor, softDelete });
	}

	onMount(() => {
    edits = { softDelete: false, ...factor };
		if (!factor.name) labelInput.focus();
	});
</script>

<div class="factor">
	<input
		bind:this={labelInput}
		name="label"
		class="title input"
		type="text"
		placeholder={factor.label || 'Factor Name'}
		value={edits.label}
		on:focus={handleFocus}
		on:blur={handleLabelBlur}
		on:change={({ currentTarget: { value }}) => (edits = { ...edits, label: value })}
		on:keypress={({ key, currentTarget }) => {
      if (key === 'esc') currentTarget.blur();
      if (key === 'Enter') {
        if (currentTarget.value) return valueInput.focus();
        else Toast.add('Factor requires a name.');
      }
    }}
		disabled={!!factor.softDelete}
    autocomplete="off"
		title="edit factor name"
	/>
	<div class="components">
		<input
			bind:this={valueInput}
			name="value"
			class="numeric input"
			type="text"
			inputmode="numeric"
			placeholder={factor.prefix + factor.value + factor.suffix}
			value={edits.prefix + edits.value + edits.suffix}
			on:focus={handleFocus}
			on:blur={handleValueBlur}
			on:change={handleValueInput}
			on:keypress={({ key }) => {
        let value = edits.value;
        if (key === 'esc') value = factor.value;
        dispatch('update', { ...factor, value });
        if (key === 'Enter') {
          dispatch('add');
        }
      }}
			disabled={!!factor.softDelete}
			title="edit quantity"
      autocomplete="off"
		/>
		<!-- <input
			name="unit"
			class="unit input"
			type="text"
			placeholder={factor.unit}
			value={edits.unit}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:change={handleEdits}
			on:keypress={handleKeyPress}
			disabled={factor.softDelete}
			title="edit unit of measure"
		/> -->
	</div>
	{#if factor.softDelete}
		<button class="button-action" on:click={toggleSoftDelete} title={'restore this factor'}>
			<img src="rotate-ccw.svg" alt="right to left u-turn arrow" />
		</button>
		<div class="strikethrough"></div>
	{:else}
		<button class="button-action" on:click={toggleSoftDelete} title={'remove this factor'}>
			<img src="trash-2.svg" alt="trash can" />
		</button>
	{/if}
</div>

<style>
	.factor {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* padding-left: 8px; */
		flex-wrap: nowrap;
		/* width: 90%; */
		/* margin-left: -1rem; */
	}

	.components {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		width: 100%;
		flex-shrink: 2;
	}

	.title {
		width: 100%;
		max-width: 20rem;
		flex-grow: 2;
	}

	.numeric {
		text-align: right;
		max-width: 4rem;
    padding: 0;
	}

  .numeric:focus {
    padding: 2px 4px;
  }

	.strikethrough {
		position: absolute;
		width: 90%;
		border: 1.5px solid #0006;
		height: 1px;
		bottom: 1.15rem;
		left: 0.25rem;
		padding: 0 1rem;
	}

	.button-action {
		cursor: pointer;
	}

	input {
		font-size: 1rem;
		font-weight: 300;
	}

  input:disabled {
    background: transparent;
  }

	button {
		position: relative;
		/* right: -0.75rem; */
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		border: none;
		background: #0000;
		opacity: 50%;
		pointer-events: auto;
	}
</style>
