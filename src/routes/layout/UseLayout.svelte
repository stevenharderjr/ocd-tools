<script lang="ts">
  import { browser } from '$app/environment';
  import LayoutSpan from './LayoutSpan.svelte'
  import LayoutPadding from './LayoutPadding.svelte'
  import LayoutSpacing from './LayoutSpacing.svelte';
  import LayoutPoints from './LayoutPoints.svelte';
  import LayoutSlider from './LayoutSlider.svelte';
  import LayoutPrecision from './LayoutPrecision.svelte';
  import BinarySelect from '$lib/BinarySelect.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { decimalsByPrecision, formatter, precisionByDecimals, sae, wordify, type MeasurementOptions } from '$lib/utils/MeasurementConverter';
  import { points as deriveLayoutPoints } from '$lib/utils/deriveLayoutPoints';
	import { getUsableRangeFromValue } from '$lib/utils/getUsableRangeFromValue';
  import type { ToggleOption } from '$lib/BinarySelect.svelte';
  import Toast from '$lib/../toast';
	import CloseButton from '$lib/CloseButton.svelte';
  const dispatch = createEventDispatcher();
  let container: HTMLLIElement;

  export let layout: App.Layout;
  export let unlocked = false;
  export let pointIndex = 0;
  let audioElement: HTMLAudioElement;
  let cued = false;
  let temp = { alignment: 'even', ...layout };
  // temp.points = deriveLayoutPoints(temp);
  let points: number[] = [];
  // let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64;
  const measurementDisplayOptions = { feet: false };
  const readable = formatter(measurementDisplayOptions);
  const alignmentOptions: [ToggleOption, ToggleOption] = [
    {
      label: 'Even',
      value: 'even'
    },
    {
      label: 'Simple',
      value: 'simple'
    }
  ];

  // $: alignment = temp.alignment || 'even';
  $: precision = temp.precision;
  $: decimals = decimalsByPrecision[precision];
  $: range = +(points[1] - points[0]).toFixed(decimals);
  // $: range = points[1] - points[0];
  $: [start, end] = temp.padding;
  $: points = deriveLayoutPoints(temp, decimals || 0);

  function update({ detail: { id, value } }) {
    console.log({ id, value, current: temp[id] });
    if (temp[id] === value) return console.log('duplicate value');
    pointIndex = 0;
    let update = value;
    if (id === 'start' || id === 'end') {
      update = id === 'start' ? [value, end] : [start, value];
      id = 'padding';
    }
    // if (id === 'precision') temp.span = +temp.span.toFixed(decimalsByPrecision[value]);
    temp = { ...temp, [id]: update };
    // temp.points = [...deriveLayoutPoints(temp)];
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
    if (!audioElement) throw new Error('Audio element missing');
    // HACK: try to maintain device audio focus with mediaSession...
    const { playbackState } = navigator.mediaSession;
    if (playbackState === 'paused') audioElement.play();
    else audioElement.pause();

    const point = nextPoint();
    if (point === undefined) return;
    const options: MeasurementOptions = { precision: temp.precision };
    const text = point ? wordify(point, options) : 'zero inches'

    say(text);
    Toast.add({ message: sae(point, options), blur: false, huge: true, replace: true });
  }

  async function cueAudio() {
    if (!browser) return;
    if (cued) return sayNextMeasurement();
    cued = true;
    const duration = 5000;
    Toast.add({ message: 'Audio enabled:\nUse bluetooth play/pause to cycle measurements\n(or continue pressing the on-screen button).', duration, blur: false });
  }

  function placeholder(message?: string) {
    Toast.add({
      message: 'COMING SOON:\n' + message,
      duration: 5000
    });
  }

  onMount(() => {
    let phrase: SpeechSynthesisUtterance;
    container.scrollIntoView({ behavior: 'smooth' });
    if (browser) {
      if (navigator.mediaSession) {
        navigator.mediaSession.setActionHandler('play', sayNextMeasurement);
        navigator.mediaSession.setActionHandler('pause', sayNextMeasurement);
      }
      if (cued && audioElement) audioElement.play().then(() => {
        navigator.mediaSession.playbackState = 'playing';
      });
    }
  });
</script>

<li bind:this={container} class="floating inline-modal">
  <button class="touchable">
    <div class="content">
      <section class="card-top">
        <h2>{temp?.label}</h2>
      </section>
      <!-- <SegmentedSelect id="precision"  /> -->
      <section class="factors">
        <LayoutPrecision {precision} on:update={update} />

        {#if temp.alignment}
        <div class="row">
          <div style="width: 100%;">
            <div style="margin-bottom: -16px;">
              <LayoutSpacing target={temp.targetSpacing} actual={range} on:update={update} {precision} alignment={temp.alignment} on:reset={resetRange} />
            </div>
            <LayoutSlider id="targetSpacing" value={temp.targetSpacing} {precision} range={getUsableRangeFromValue(temp.targetSpacing)} on:update={update} on:reset={resetRange} />
          </div>
          <div>
            <BinarySelect id="alignment" options={alignmentOptions} selected={temp.alignment} orientation="vertical" on:change={update} />
          </div>
        </div>
        {:else}
        <div class="shrink">
          <LayoutSpacing target={temp.targetSpacing} actual={range} on:update={update} {precision} alignment={temp.alignment} on:reset={resetRange} />
        </div>
        <LayoutSlider id="targetSpacing" value={temp.targetSpacing} {precision} range={getUsableRangeFromValue(temp.targetSpacing)} on:update={update} on:reset={resetRange} />
        {/if}

        <div class="shrink">
          <LayoutPadding {start} {end} on:update={update} {precision} />
        </div>
        <div class="row">
          <LayoutSlider id="start" value={start} {precision} range={getUsableRangeFromValue(start, [0, undefined])} on:update={update} on:reset={resetRange} />
          <LayoutSlider id="end" value={end} {precision} range={getUsableRangeFromValue(end, [0, undefined])} on:update={update} on:reset={resetRange} />
        </div>

        <!-- <InvisibleSlider value={temp.span} range={getUsableRangeFromValue(temp.padding)} on:update on:reset={resetRange} /> -->
        <div class="shrink">
          <LayoutSpan span={temp.span} {precision} on:update={update} />
          <!-- <LayoutSpacing target={temp.targetSpacing} actual={range} on:update={update} precision={temp.precision} /> -->
        </div>
        <LayoutSlider id="span" value={temp.span} {precision} range={getUsableRangeFromValue(temp.span)} on:update={update} on:reset={resetRange} />

        <LayoutPoints {points} {precision} on:cue={cueAudio} />
        <!-- <input type="range" min={inches(span)} -->
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'} on:click={cancel}>
        <img height="16px" width="16px" src="x.svg" alt="edit" />
      </button>
  </div>
  <div class="audio-controls">
    <!-- <div>
      <button on:click|stopPropagation={() => placeholder('Switch to save/edit mode with current changes.')} title="add new layout" style="margin: auto; background: #0009;">
        <img src="edit.svg" />
      </button>
    </div> -->
    <!-- <div> -->
      <button on:click|stopPropagation={cueAudio} title="cue audio" style="margin: auto; background: #0009;">
        <img src="headphones.svg" alt="headphones"/>
      </button>
    <!-- </div> -->
    <!-- <div>
      <button on:click|stopPropagation={() => placeholder('Copy measurements to device clipboard.')} title="add new layout" style="margin: auto; background: #0009;">
        <img src="clipboard.svg" />
      </button>
    </div> -->
  </div>
  {#if cued}
    <audio bind:this={audioElement} playsinline={true} src="1-second-of-silence.mp3">Audio Element</audio>
  {/if}
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
  .shrink {
    margin-bottom: -24px;
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1.5rem;
    margin-right: -0.5rem;
  }
  .audio-controls {
    position: sticky;
    width: calc(100% - 8px);
    margin-left: 4px;
    bottom: 0;
    height: 6rem;
    pointer-events: none;
		display: flex;
		justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    padding: 1rem 1rem;
    margin-top: -2.5rem;
    /* background: #f006; */
    background: linear-gradient(#fff0, #fff9, #fff);
    /* backdrop-filter: blur(2px); */
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .audio-controls img {
    filter: invert(0.1);
    -webkit-filter: invert(1);
    height: 1.25rem;
    width: 1.25rem;
  }
	.audio-controls button {
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
	}
</style>
