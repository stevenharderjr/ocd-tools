<script lang="ts">
  import LayoutSpan from './LayoutSpan.svelte'
  import LayoutPadding from './LayoutPadding.svelte'
  import LayoutSpacing from './LayoutSpacing.svelte';
  import LayoutPoints from './LayoutPoints.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { formatter } from '$lib/utils/MeasurementConverter';
  import { points as deriveLayoutPoints } from '$lib/utils/deriveLayoutPoints';
  const dispatch = createEventDispatcher();
  let container: HTMLLIElement;

  export let layout: App.Layout;
  const { targetSpacing: spacing } = layout || {};
  let span = layout.span;
  const [start, end] = layout?.padding || [];
  const measurementDisplayOptions = { feet: false };
  const readable = formatter(measurementDisplayOptions);
  const points = deriveLayoutPoints(layout);

  function cancel() {
    dispatch('close');
  }

  onMount(() => container.scrollIntoView({ behavior: 'smooth' }));
</script>

<li bind:this={container} class="floating inline-modal">
  <button class="touchable" on:click={cancel}>
    <div class="content">
      <section class="card-top">
        <h2>{layout?.label}</h2>
      </section>
      <section class="factors">
        <LayoutSpan span={layout.span} />
        <LayoutPadding padding={layout.padding} />
        <LayoutSpacing spacing={[layout.targetSpacing, points[1] - points[0]]} />
        <LayoutPoints {points} />
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
    width: fit-content;
		max-width: calc(100vw - 1.5rem);
    min-width: 100%;
		background: #fff;
		border-radius: 8px;
		margin: 0 4rem 1rem 4rem;
    align-self: center;
	}
  .horizontal-scroll {
    overflow-x: auto;
  }
</style>
