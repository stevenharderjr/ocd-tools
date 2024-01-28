<script lang="ts">
	import Confirm from '$lib/Confirm.svelte';
	import { ratios, newRatio, blur } from '../stores';
  import { diff, invalidate } from '$lib/utils/tester';
	import Toast from '../toast';

  interface Confirmation {
    prompt: string;
    accept: () => void;
    reject: () => void;
  }

	let use: App.RatioFlag = undefined;
	let edit: App.RatioFlag = undefined;
  let confirmation: Confirmation | undefined;
  let copy = [...$ratios];

  function initialize() {
    use = undefined;
    edit = undefined;
    confirmation = undefined;
  }

  const reject = () => {
    confirmation = undefined;
  }

	function addRatio() {
		if (edit) cancel();

    use = undefined;
		edit = newRatio();
		copy = [...copy, edit];
	}

	function useRatio({ detail: ratio }: { detail: App.Ratio }) {
    const accept = () => {
      initialize();
      copy = [...$ratios];
      use = { ...ratio };
    }

    if (!edit) return accept();

    const editId = edit.id;
    const original = copy.find(({ id }) => (id === editId));
    if (!original || !diff(original, edit)) return accept();

    confirmation = { prompt: `Discard changes${original?.label ? ` to "${original.label}"` : ''}?`, accept, reject };
	}

  function renameRatio({ detail: ratio }: { detail: App.Ratio }) {
    edit = { ...edit, ...ratio };
  }

	function editRatio({ detail: ratio }: { detail: App.Ratio }) {
    const accept = () => {
      initialize();
      copy = [...$ratios];
      edit = { ...ratio };
    }

    if (!edit) return accept();

    const factors = edit.factors.filter(factor => factor.label !== '');
    const edited = { ...edit, factors };

    const editId = edited.id;
    const original = copy.find(({ id }) => (id === editId));
    if (!original || !diff(original, edited)) return accept();

    confirmation = { prompt: `Discard changes${original?.label ? ` to "${original.label}"` : ''}?`, accept, reject };
	}

  function updateFactor({ detail: update }: { detail: App.Factor }) {
    if (!edit) return;
    const updateId = update.id;
    let factors: App.Factor[];
    let original: App.FactorFlag = undefined;

    if (update.softDelete && invalidate(update)) factors = edit.factors.filter(({ id }) => (id !== updateId));
    else factors = edit?.factors.map(factor => {
      if (factor.id === updateId) {
        original = factor;
        return update;
      }
      return factor;
    });

    if (!original && !update.softDelete) factors.push(update);

    edit = { ...edit, factors };
  }

	function saveRatio() {
    if (!edit) return;
    const factors = edit?.factors.filter(({ label, softDelete }) => (!softDelete && label !== ''));
    let temp = { ...edit, factors };

    const reason = invalidate(temp);
    if (reason) return Toast.add({ message: reason, blur: true });

    const updateId = edit.id;
    let original: App.RatioFlag;
    const updatedRatios: App.Ratio[] = copy.map((ratio, i) => {
      if (ratio.id === updateId) {
        const name = temp.label?.toLowerCase();
        original = ratio;
        return { ...temp } as App.Ratio;
      }
      return ratio;
    });

    if (!original) updatedRatios.push(temp);

    if (!diff(original, temp)) return initialize();

    $ratios = updatedRatios;
    copy = [...$ratios];
    initialize();
	}

	function resetRatio() {
    const resetRatio = use || edit;
    if (!resetRatio) return;
    const resetId = resetRatio.id;
    const original = $ratios.find(({ id }) => (id === resetId));
    copy = [...$ratios];
    if (use) use = { ...original };
    if (edit) edit = { ...original };
  }

	function deleteRatio() {
    if (!edit) return;

    const factors = edit.factors.filter(factor => factor.label !== '');
    const temp = { ...edit, factors };

    const deleteId = temp.id;
    let original: App.RatioFlag = undefined;
    const filteredRatios = $ratios.filter(ratio => {
      if (ratio.id !== deleteId) return true;
      original = { ...ratio };
      return false;
    });

    const accept = () => {
      $ratios = filteredRatios;
      copy = [...$ratios];
      initialize();
    }

    if (!temp?.factors?.length || 0 > 1) return accept();

    confirmation = { prompt: temp?.label ? `Delete "${temp.label}"?` : 'Ratio will be discarded.', accept, reject };
  }

	function cancel(callback?: any) {
    const accept = () => {
      copy = [...$ratios];
      initialize();
      if (typeof callback === 'function') callback();
    }

    if (use || !edit) return accept();

    const editingId = edit.id;
    // is there a fallback for this ratio?
    const original: App.RatioFlag = $ratios.find(({ id }) => (id === editingId));
    // is this a new ratio that's not ready to be saved?
    if (invalidate(original) && invalidate(edit)) return deleteRatio();

    // have any changes been made?
    if (!diff(original, edit)) return accept();

    confirmation = { prompt: `Discard changes${original?.label ? ` to "${original.label}"` : ''}?`, accept, reject }
	}

  function handleKeyboardCancel({ key }: KeyboardEvent) {
    if (key === 'esc') cancel({});
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="backdrop" on:click|self={cancel} on:keypress={handleKeyboardCancel}>
  <!-- <div class="background-tint" style={`opacity:${!(use || edit) ? 0 : 1}; backdrop-filter: ${!(use || edit) ? 'blur(0) opacity(0) brightness(1)' : 'blur(4px) opacity(1) brightness(0.95)'};`} /> -->
  <div class="background-haze" style={(use || edit) ? `z-index:4; backdrop-filter:blur(1px);` : ''} />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="card-stack" on:click={cancel}>
    {#each copy as ratio}
      {#if ratio.id === use?.id}
        <UseRatio ratio={use} on:close={cancel} on:reset={resetRatio} />
      {:else if ratio.id === edit?.id}
        <EditRatio
        ratio={edit}
          on:close={cancel}
          on:save={saveRatio}
          on:reset={resetRatio}
          on:delete={deleteRatio}
          on:rename={renameRatio}
          on:update={updateFactor}
        />
      {:else}
        <Ratio {ratio} on:use={useRatio} on:edit={editRatio} on:reset={resetRatio} />
      {/if}
    {/each}
  </div>
  <div class="button-container">
    <a href="/" title="return to dashboard">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="arrow-left.svg" aria-hidden={true}/>
    </a>
    <button on:click={addRatio} title="add new ratio" disabled={!!(edit)}>
      <svg aria-hidden="true" viewBox="0 0 1 1">
        <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
      </svg>
    </button>
  </div>
  {#if confirmation}
    <Confirm
      question={confirmation.prompt}
      on:confirm={confirmation.accept}
      on:reject={confirmation.reject}
    />
  {/if}
</div>



<style>
  .backdrop {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: space-between;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .background-haze {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #ccc9;
    pointer-events: none;
  }

	.button-container {
    pointer-events: none;
    z-index: 4;
		position: absolute;
		display: flex;
		justify-content: space-between;
    align-self: center;
    align-items: flex-end;
    gap: 1rem;
    padding: 0 1.5rem;
    bottom: 1.5rem;
		pointer-events: none;
		max-width: 100%;
    width: var(--column-width);
	}

  img {
    filter: invert(0.1);
    height: 1.25rem;
    width: 1.25rem;
  }

	button, a {
    pointer-events: auto;
		border-radius: 9999px;
		background: #fffc;
		width: 3rem;
		height: 3rem;
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

	svg {
		width: 33%;
		height: 33%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #000c;
	}
</style>
