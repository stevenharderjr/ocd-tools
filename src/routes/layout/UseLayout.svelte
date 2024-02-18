<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { measurement } from '$lib/utils/MeasurementConverter';
  import { points } from '$lib/utils/deriveLayoutPoints';
  const dispatch = createEventDispatcher();

  export let layout: App.LayoutFlag;
  const {spacing, span } = layout || {};
  const [start, end] = layout?.padding || [];

  const details = (start && end && span && spacing) ? [
    readable(span) + ' span',
    'Points: ' + layout ? points(layout).map(readable).join(', ') : 'Oops!',
    readable(spacing) + ' spacing',
    (start === end)
      ? readable(start) + ' padding'
      : 'Padding: ' + readable(start) + ', ' + readable(end)
  ] : [];

  function readable(inches: number) {
    if (inches) return measurement.fromDecimalInches(inches).readable;
  }

  function cancel() {
    dispatch('close');
  }
</script>

<li class="floating inline-modal">
  <button class="touchable" on:click={cancel}>
    <div class="content">
      <section class="card-top">
        <h2>{layout?.label}</h2>
      </section>
      <section class="factors">
        {#each details as detail}
          <span>{detail}</span>
        {/each}
        <!-- <input type="range" min={inches(span)} -->
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'}>
      <img height="16px" width="16px"src="edit.svg" alt="edit" />
    </button>
  </div>
</li>

<style>
  	.inline-modal {
    z-index: 5;
    scroll-margin-top: 20vh;
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #fff;
		border-radius: 8px;
		padding: 10px 14px;
		margin-bottom: 1rem;
	}
</style>
