<script lang="ts">
  import LayoutSummary from './LayoutSummary.svelte';
  import UseLayout from './UseLayout.svelte';
  import { layouts } from '../../stores';

  let use: App.LayoutFlag = undefined;
  let edit: App.LayoutFlag = undefined;

  function useLayout({ detail: layout }) {
    edit = undefined;
    use = { ...layout };
  }

  function cancel() {
    use = undefined;
    edit = undefined;
  }
</script>

<div class="backdrop">
  <div class="background-haze" style={(use || edit) ? `z-index:4; backdrop-filter:blur(1px);` : ''} />
  <ul class="card-stack">
    {#each $layouts as layout}
      {#if layout.id === use?.id}
        <UseLayout layout={use} on:close={cancel}/>
      {:else}
        <LayoutSummary {layout} on:select={useLayout}/>
      {/if}
    {/each}
  </ul>
  <div class="button-container" style={use ? 'z-index: 8;' : ''}>
    {#if use}
      <button on:click title="add new layout" disabled style="margin: auto; background: #777;">
        <img style="filter: invert(1); -webkit-filter: invert(1);" src="headphones.svg" />
      </button>
    {:else}
      <a href="/" title="return to dashboard">
        <img height="16px" width="16px"src="arrow-left.svg" alt="left arrow" aria-hidden={true} />
      </a>
      <button on:click title="add new layout" disabled>
        <svg aria-hidden="true" viewBox="0 0 1 1">
          <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
        </svg>
      </button>
    {/if}
  </div>
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