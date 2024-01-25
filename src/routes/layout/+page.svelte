
<div class="backdrop">
  <ul class="card-stack">
    <li class="floating card">
      <h1>Layout Equalizer</h1>
    </li>
  </ul>
  <div class="button-container">
    <a href="/" title="return to dashboard">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="arrow-left.svg" aria-hidden={true}/>
    </a>
    <button on:click title="add new layout" disabled>
      <svg aria-hidden="true" viewBox="0 0 1 1">
        <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
      </svg>
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