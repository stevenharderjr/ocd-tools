<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LayoutSpan from './LayoutSpan.svelte';
  import LayoutPadding from './LayoutPadding.svelte';
  import LayoutSpacing from './LayoutSpacing.svelte';
  import { formatter, sae } from '$lib/utils/MeasurementConverter';
  const dispatch = createEventDispatcher();

  export let layout: App.Layout;
  const displayOptions = {
    padding: { feet: false },
    span: { precision: layout.precision },
    spacing: { feet: false
  }};

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
          <span class="small">&#8677; {sae(layout.padding[0], displayOptions.padding) || '0"'}</span>
          <span>{sae(layout.span, displayOptions.span)} / {sae(layout.targetSpacing, displayOptions.spacing)}</span>
          <span class="small">{sae(layout.padding[1], displayOptions.padding) || '0"'} &#8676;</span>
        </div>
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
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .small {
    font-size: small;
  }
  span {
    white-space: nowrap;
    width: 100%;
    text-align: center;
  }
</style>
