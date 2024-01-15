<script lang="ts">
	// import Confirm from '$lib/Confirm.svelte';
	// import Toast from '../toast';
  // import { pinned } from '../stores';
</script>

<div class="backdrop">
  <section class="tool-list">
    <a class="floating card" href="/ratioizer">
      <h2 class="title-bar">Ratioizer</h2>
      <svg aria-hidden="true" viewBox="0 0 1 1" style="background: #f006;">
        <polygon points="0,0 1,0 1,1 0,0" />
      </svg>
      <svg class="skewed-wedge" />
    </a>
    <a class="floating card" href="/layout-equalizer">Layout Equalizer</a>
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
  a, a:visited {
    text-decoration: none;
    user-select: none;
  }

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
    width: 100%;
    max-width: 20rem;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  .card {
    align-self: center;
    width: 100%;
    max-width: 20rem;
    height: 6rem;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
  }

  .title-bar {
    width: 100%;
    height: 2rem;
    color: white;
    background: #333;
    padding: 0.5rem 1rem;
  }

  .askew {
    width: 100%;
    height: 1rem;
    background: #f006;
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