<script lang="ts">
	import Confirm from '$lib/Confirm.svelte';
	import Ratio from '$lib/Ratio.svelte';
	import EditRatio from '$lib/EditRatio.svelte';
	import UseRatio from '$lib/UseRatio.svelte';
	import { ratios, newRatio } from '../stores';
  import { diff, invalidate } from '$lib/utils/tester';
	import Toast from '../toast';

  interface Confirmation {
    prompt: string;
    accept: () => void;
    reject: () => void;
  }

	let using: App.RatioFlag = undefined;
	let editing: App.RatioFlag = undefined;
	let deleting: App.RatioFlag = undefined;
  let confirmation: Confirmation | undefined;

	function addRatio() {
		if (editing) return;

    using = undefined;
		editing = newRatio();
		$ratios = [...$ratios, editing];
	}

	function confirm(callbacks) {
    confirmation = callbacks;
	}

	function useRatio({ detail: ratio }: { detail: App.Ratio }) {
		editing = undefined;
		using = { ...ratio };
	}

	function updateRatio({ detail: update }: { detail: App.Ratio }) {
    // save updated ratio (if it cannot be invalidated)
    const updateId = update.id;
    let updateIndex = -1;
    const updatedRatios = $ratios.map((ratio, i) => {
      if (ratio.id === updateId) {
        updateIndex = i;
        return { ...update };
      }
      return ratio;
    });

    const prior = $ratios[updateIndex];
    const difference = diff(update, prior);

    if (difference) {
      console.log('Change recognized: ', difference);
      const reason = invalidate(update);
      if (reason) return Toast.add({ message: reason, blur: true });
      $ratios = updatedRatios;
    }

    editing = undefined;
	}

	function resetRatio() {
    const resetRatio = using || editing;
    if (!resetRatio) return;
    const resetId = resetRatio.id;
    $ratios = $ratios.map(ratio => (ratio.id === resetId ? { ...resetRatio } : ratio));
  }

	function editRatio({ detail: ratio }: { detail: App.Ratio }) {
		using = undefined;
		editing = { ...ratio };
	}

	function deleteRatio({ detail: ratio }: { detail: App.Ratio }) {
    const deleteId = ratio?.id;
    const filteredRatios = $ratios.filter(({ id }) => id !== deleteId);

    const accept = () => {
      $ratios = filteredRatios;
      deleting = undefined;
      using = undefined;
      editing = undefined;
      confirmation = undefined;
    }

    const reject = () => {
      confirmation = undefined;
    }

    const reason = invalidate(ratio);
    console.log(reason);
    if (reason) return accept();

    confirmation = { prompt: editing?.label ? `Delete "${editing.label}"?` : 'Ratio will be discarded.', accept, reject };
  }

	function cancel(detail?: any) {
    console.log('cancel')
    const accept = () => {
      deleting = undefined;
      using = undefined;
      editing = undefined;
      confirmation = undefined;
    }

    const ratio = detail;
    if (!ratio || !editing || ratio.currentTarget) return accept();

    const reject = () => {
      confirmation = undefined;
    }

    const editingId = ratio.id;
    const currentEdit = $ratios.find(({ id }, index) => id === editingId) as App.Ratio;

    let reason = invalidate(currentEdit) && invalidate(ratio);
    if (reason) {
      return deleteRatio({ detail: ratio });
    }

    reason = !diff(currentEdit, ratio);
    if (reason) {
      deleting = currentEdit;
      console.log('no changes');
      return accept();
    }

    confirmation = { prompt: 'Discard changes?', accept, reject }
	}

  function handleKeyboardCancel({ key }) {
    if (key === 'esc') cancel({});
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="ratios" on:click|self={cancel} on:keypress={handleKeyboardCancel} aria-roledescription="cancel using or editing">
	{#each $ratios as ratio}
		{#if using?.id === ratio.id}
			<UseRatio {ratio} on:close={cancel} />
		{:else if editing?.id === ratio.id}
			<EditRatio
				{ratio}
				on:update={updateRatio}
				on:close={cancel}
				on:reset={resetRatio}
				on:delete={deleteRatio}
			/>
		{:else}
			<Ratio {ratio} on:use={useRatio} on:edit={editRatio} />
		{/if}
	{/each}
</div>

{#if confirmation}
	<Confirm
		question={confirmation.prompt}
		on:confirm={confirmation.accept}
		on:reject={confirmation.reject}
	/>
{/if}

<div class="button-container">
	<button on:click={addRatio} aria-label="Add new ratio.">
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
		</svg>
	</button>
</div>

<style>
	.ratios {
		max-width: 100%;
		display: flex;
		flex-direction: column;
		pointer-events: auto;
	}
	.button-container {
		position: absolute;
		display: flex;
		justify-content: center;
		bottom: 1.5rem;
		pointer-events: none;
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
	}
	button {
		border-radius: 9999px;
		background: #fff9;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		touch-action: manipulation;
		font-size: 2rem;
		box-shadow: 0 0 4px 2px #0003;
		backdrop-filter: blur(4px);
		pointer-events: auto;
	}

	svg {
		width: 30%;
		height: 30%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #444;
	}
</style>
