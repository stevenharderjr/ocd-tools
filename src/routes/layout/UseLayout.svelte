<script lang="ts">
  import { browser } from '$app/environment';
  import LayoutSpan from './LayoutSpan.svelte'
  import LayoutPadding from './LayoutPadding.svelte'
  import LayoutSpacing from './LayoutSpacing.svelte';
  import LayoutPoints from './LayoutPoints.svelte';
  import LayoutSlider from './LayoutSlider.svelte';
  import LayoutPrecision from './LayoutPrecision.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { formatter, wordify } from '$lib/utils/MeasurementConverter';
  import { points as deriveLayoutPoints } from '$lib/utils/deriveLayoutPoints';
	import { getUsableRangeFromValue } from '$lib/utils/getUsableRangeFromValue';
  import Toast from '$lib/../toast';
	import CloseButton from '$lib/CloseButton.svelte';
  const dispatch = createEventDispatcher();
  let container: HTMLLIElement;

  export let layout: App.Layout;
  export let unlocked = false;
  export let pointIndex = 0;
  let audio: HTMLAudioElement;
  let temp = { ...layout };
  let points: number[] = [];
  let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64;
  const measurementDisplayOptions = { feet: false };
  const readable = formatter(measurementDisplayOptions);

  $: precision = temp.precision;
  $: range = points[1] - points[0];
  $: [start, end] = temp.padding;
  $: points = deriveLayoutPoints(temp);

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

  function nextPoint() {
    if (!points?.length) return;
    const point = points[pointIndex++];
    if (pointIndex >= points.length) pointIndex = 0;
    return point;
  }

  function say(phrase: string) {
    if (phrase && browser && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      window.speechSynthesis.speak(utterance);
    }
  }

  function sayNextMeasurement() {
    // audio.pause();
    audio.play();
    const point = nextPoint();
    if (point !== undefined) say(point ? wordify(point, { precision }) : 'zero inches');
  }

  onMount(() => {
    let phrase: SpeechSynthesisUtterance;
    container.scrollIntoView({ behavior: 'smooth' });
    if (browser) {
      if (navigator.mediaSession) {
        navigator.mediaSession.setActionHandler('play', sayNextMeasurement);
        navigator.mediaSession.setActionHandler('pause', sayNextMeasurement);
        navigator.mediaSession.setActionHandler('stop', () => audio.play());
      }
      audio.play();
    }
  });
</script>

<li bind:this={container} class="floating inline-modal">
  <button class="touchable">
    <div class="content">
      <section class="card-top">
        <h2>{temp?.label}</h2>
      </section>
      <section class="factors">

        <div class="grid-row">
          <div style="grid-colum: 1;">
            <div class="shrink">
              <LayoutSpan span={temp.span} on:update={update} />
              <!-- <LayoutSpacing target={temp.targetSpacing} actual={range} on:update={update} {precision} /> -->
            </div>
            <LayoutSlider id="span" value={temp.span} {precision} range={getUsableRangeFromValue(temp.span)} on:update={update} on:reset={resetRange} />
          </div>
          <div style="grid-column: 2;">
            <LayoutPrecision precision={temp.precision} on:update={update} />
          </div>
        </div>
        <div>
          <div class="shrink">
            <LayoutPadding {start} {end} on:update={update} {precision} />
          </div>
          <div class="row">
            <LayoutSlider id="start" value={start} {precision} range={getUsableRangeFromValue(start)} on:update={update} on:reset={resetRange} />
            <LayoutSlider id="end" value={end} {precision} range={getUsableRangeFromValue(end)} on:update={update} on:reset={resetRange} />
          </div>
        </div>
        <!-- <InvisibleSlider value={temp.span} range={getUsableRangeFromValue(temp.padding)} on:update on:reset={resetRange} /> -->
        <div class="grid-row">
          <div style="grid-colum: 1;">
            <div class="shrink">
              <LayoutSpacing target={temp.targetSpacing} actual={range} on:update={update} {precision} />
            </div>
            <LayoutSlider id="targetSpacing" value={temp.targetSpacing} {precision} range={getUsableRangeFromValue(temp.targetSpacing)} on:update={update} on:reset={resetRange} />
          </div>
          <div style="grid-column: 2;">
            <LayoutPrecision precision={temp.precision} on:update={update} />
          </div>
        </div>
        <LayoutPoints {points} {precision} />
        <!-- <input type="range" min={inches(span)} -->
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'} on:click={cancel}>
        <img height="16px" width="16px" src="x.svg" alt="edit" />
      </button>
  </div>
  <audio bind:this={audio} playsinline={true} src="1-second-of-silence.mp3">Audio Element</audio>
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
  .grow {
    margin-bottom: -1rem;
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1.5rem;
    margin-right: -0.5rem;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
  audio {
    pointer-events: auto;
  }
</style>
