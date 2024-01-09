<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
  import { fixes } from '$lib/utils/fixes';
	import Toast from '../toast';
	const dispatch = createEventDispatcher();
	export let factor: App.Factor;
  let edits = { softDelete: false, ...factor };
  // let label = factor.label;
  // let value = factor.value;
  // let prefix = factor.prefix;
  // let suffix = factor.suffix;
  let labelInput: HTMLInputElement;
  let valueInput: HTMLInputElement;
  // $: fixed = fixes(value);

	function handleBlur({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const { value: inputValue, name: key } = currentTarget;
		const defaultValue = factor[key as keyof App.Factor];
    let override = defaultValue + '';
		if (override && !inputValue) {
      currentTarget.value = override;
    }
    edits = { ...edits, [key]: inputValue || override };
    dispatch('update', edits);
	}

  function handleValueBlur({ currentTarget }) {
    const { value: inputValue } = currentTarget;
    if (!inputValue) {
      const { prefix, value, suffix } = factor;
      edits = { ...edits, prefix, value, suffix };
      valueInput.value = prefix + value + suffix;
    }
    dispatch('update', edits);
  }

	function handleFocus({ currentTarget }: { currentTarget: HTMLInputElement }) {
		currentTarget.value = '';
	}

  function handleLabelInput({ currentTarget: { value }}) {
    edits = { ...edits, label: value };
  }

  function handleValueInput({ currentTarget: { value: inputValue } }) {
    edits = { ...edits, value: inputValue };
  }

	function handleEdits({ currentTarget: { value: inputValue, name: key } }: { currentTarget: HTMLInputElement | { value: string | number | boolean, name: keyof App.Factor }}) {
		if (!inputValue && inputValue !== false) return;
		if (key === 'value') inputValue = +inputValue;
		edits = {
			...edits,
			[key]: inputValue || inputValue === false ? inputValue : factor[key as keyof App.Factor]
		};
		// dispatch('update', payload);
	}

	function toggleDelete() {
		handleEdits({ currentTarget: { value: !edits.softDelete, name: 'softDelete' } });
	}

	function handleKeyPress(event: KeyboardEvent) {
    const { currentTarget, key }: { currentTarget: HTMLInputElement, key: string } = event;
    console.log({ key });
    if (key !== 'esc' && key !== 'Enter') return;
    if (key === 'esc') edits = { softDelete: false, ...factor };
    currentTarget.blur();
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
		on:blur={handleBlur}
		on:change={({ currentTarget: { value }}) => (edits = { ...edits, label: value })}
		on:keypress={({ key }) => {
      if (key === 'esc') edits = { ...edits, label: factor.label };
      if (key === 'Enter') {
        if (edits.label) return valueInput.focus();
        else Toast.add('Factor requires a name.');
      }
    }}
		disabled={factor.softDelete}
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
			on:change={({ currentTarget: { value: inputValue }}) => {
        const { value, prefix, suffix } = fixes(inputValue);
        edits = { ...edits, value, prefix, suffix };
      }}
			on:keypress={({ key }) => {
        if (key === 'esc') value = factor.value + '';
        if (key === 'Enter') {
          dispatch('update', { ...factor, ...edits, label });
          dispatch('tab');
        }
      }}
			disabled={edits.softDelete}
			title="edit quantity"
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
		<button class="button-action" on:click={toggleDelete} title={'restore this factor'}>
			<img src="undo.svg" alt="right to left u-turn arrow" />
		</button>
		<div class="strikethrough"></div>
	{:else}
		<button class="button-action" on:click={toggleDelete} title={'remove this factor'}>
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
		max-width: 6rem
	}

	.strikethrough {
		position: absolute;
		width: 85%;
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
