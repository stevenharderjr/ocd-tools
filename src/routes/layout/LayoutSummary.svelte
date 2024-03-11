<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Ellipses from './Ellipses.svelte';
  import LayoutSpan from './LayoutSpan.svelte';
  import LayoutPadding from './LayoutPadding.svelte';
  import LayoutSpacing from './LayoutSpacing.svelte';
  import { formatter, sae } from '$lib/utils/MeasurementConverter';
	import Toast from '../../toast';
  const dispatch = createEventDispatcher();

  export let layout: App.Layout;
  const displayOptions = { feet: layout.targetSpacing > 144 };

  function use() {
    dispatch('select', layout);
  }
</script>

<li class="floating card">
  <button class="touchable" on:click={use}>
    <div class="content">
      <section class="card-top">
        <h2>{layout?.label}</h2>
      </section>
      <section class="factors">
        <div class="row">
          <!-- <span class="small padding-measurement">{sae(layout.padding[0], displayOptions) || '0"'}<span class="symbol">&#8677;</span></span> -->
          <span class="small padding-measurement">{sae(layout.padding[0], displayOptions) || '0"'}</span>
          <div class="row">
            <span class="small"><Ellipses count={3} direction={1} /></span>
            <span class="spacing-measurement">{sae(layout.targetSpacing, displayOptions)}</span>
            <span class="small"><Ellipses count={3} direction={-1} /></span>
          </div>
          <span class="small padding-measurement">{sae(layout.padding[1], displayOptions) || '0"'}</span>
          <!-- <span class="small padding-measurement"><span class="symbol">&#8676;</span>{sae(layout.padding[1], displayOptions) || '0"'}</span> -->
        </div>
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'} on:click={() => Toast.add({ message: 'Editing not yet enabled.', dismissable: true })}>
      <img height="16px" width="16px"src="edit.svg" alt="edit" />
    </button>
  </div>
</li>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .small {
    font-size: 0.9rem;
  }
  .spacing-measurement {
    font-size: 1rem;
    /* flex-shrink: 2; */
    padding: 0 0.5rem;
  }
  .padding-measurement {
    width: 100%;
    display: flex;
    align-items: center;
  }
  /* .symbol {
    font-size: 1rem;
    color: #777;
    padding: 0 0.5rem;
  } */
  span {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
