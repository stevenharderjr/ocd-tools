<script lang="ts">
  import ToolCard from './ToolCard.svelte';
	// import Confirm from '$lib/Confirm.svelte';
	// import Toast from '../toast';
  // import { pinned } from '../stores';
</script>

<div class="backdrop">
  <section class="tool-list">
    <ToolCard title="Ratioizer" description="Keeps sets of values and allows dynamic adjustments without changing proportions between them." href="/ratioizer" />
    <ToolCard title="Layout Equalizer" description="Plot padding and equal spacing while accounting for material width." href="layout" />
  </section>

  <div class="button-container">
    <button on:click title="open user profile">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="user.svg" aria-hidden={true}/>
    </button>
    <!-- <button on:click={addRatio} title="add new ratio" disabled={!!(edit)}>
      <svg aria-hidden="true" viewBox="0 0 1 1">
        <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
      </svg>
    </button> -->
    <button on:click title="download for offline use">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="download.svg" aria-hidden={true}/>
    </button>
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

  .tool-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    width: 100%;
    max-width: var(--column-width);
    gap: 1rem;
    padding: 1rem 0.75rem 40vh 0.75rem;
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

	button {
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