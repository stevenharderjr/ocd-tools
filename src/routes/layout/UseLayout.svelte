<script lang="ts">
  import LayoutSpan from './LayoutSpan.svelte'
  import LayoutPadding from './LayoutPadding.svelte'
  import LayoutSpacing from './LayoutSpacing.svelte';
  import LayoutPoints from './LayoutPoints.svelte';
  import LayoutSlider from './LayoutSlider.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { formatter } from '$lib/utils/MeasurementConverter';
  import { points as deriveLayoutPoints } from '$lib/utils/deriveLayoutPoints';
	import { getUsableRangeFromValue } from '$lib/utils/getUsableRangeFromValue';
  const dispatch = createEventDispatcher();
  let container: HTMLLIElement;

  export let layout: App.Layout;
  export let unlocked = false;
  let temp = { ...layout };
  const measurementDisplayOptions = { feet: false };
  const readable = formatter(measurementDisplayOptions);

  $: points = deriveLayoutPoints(temp);
  $: range = points[1] - points[0];
  $: [start, end] = temp.padding;
  $: [min, max] = getUsableRangeFromValue(temp.span);

  function update({ detail: { id, value } }){
    let update = value;
    if (id === 'start' || id === 'end') {
      update = id === 'start' ? [value, end] : [start, value];
      id = 'padding';
    }
    console.log({ key: id, value: update });
    temp = { ...temp, [id]: update };
  }

  function resetRange({ detail: { id, value }}: { detail: { id: string, value: number }}) {
    const [min, max] = getUsableRangeFromValue(value);
  }

  function cancel() {
    dispatch('close');
  }

  onMount(() => container.scrollIntoView({ behavior: 'smooth' }));
</script>

<li bind:this={container} class="floating inline-modal">
  <button class="touchable" on:click={cancel}>
    <div class="content">
      <section class="card-top">
        <h2>{temp?.label}</h2>
      </section>
      <section class="factors">
        <div class="shrink">
          <LayoutSpan span={temp.span} on:update={update} />
        </div>
        <LayoutSlider id="span" value={temp.span} range={getUsableRangeFromValue(temp.span)} on:update={update} on:reset={resetRange} />
        <div class="shrink">
          <LayoutPadding {start} {end} on:update={update} />
        </div>
        <div class="row">
          <LayoutSlider id="start" value={start} range={getUsableRangeFromValue(start)} on:update={update} on:reset={resetRange} />
          <LayoutSlider id="end" value={end} range={getUsableRangeFromValue(end)} on:update={update} on:reset={resetRange} />
        </div>
        <!-- <InvisibleSlider value={temp.span} range={getUsableRangeFromValue(temp.padding)} on:update on:reset={resetRange} /> -->
        <div class="shrink">
          <LayoutSpacing target={temp.targetSpacing} actual={range} on:update={update} />
          </div>
        <LayoutSlider id="targetSpacing" value={temp.targetSpacing} range={getUsableRangeFromValue(temp.targetSpacing)} on:update={update} on:reset={resetRange} />
        <LayoutPoints {points} />
        <!-- <input type="range" min={inches(span)} -->
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'}>
      {#if unlocked}
        <img height="16px" width="16px" src="unlock.svg" alt="edit" />
      {:else}
        <img height="16px" width="16px" src="lock.svg" alt="edit" />
      {/if}
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
  .shrink {
    margin-bottom: -1.5rem;
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 2rem;
    margin-right: -0.5rem;
  }
</style>
