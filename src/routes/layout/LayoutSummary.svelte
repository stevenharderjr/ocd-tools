<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LayoutSpan from './LayoutSpan.svelte';
  import LayoutPadding from './LayoutPadding.svelte';
  import LayoutSpacing from './LayoutSpacing.svelte';
  import { formatter } from '$lib/utils/MeasurementConverter';
  const dispatch = createEventDispatcher();

  export let layout: App.Layout;
  const displayOptions = { feet: false, precision: layout.precision };
  const readable = formatter(displayOptions);
  const span = readable(layout.span);

  const spacing = readable(layout.targetSpacing);

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
        <LayoutSpan span={layout.span} />
        <LayoutPadding start={layout.padding[0]} end={layout.padding[1]} />
        <LayoutSpacing targetSpacing={layout.targetSpacing} />
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'}>
      <img height="16px" width="16px"src="edit.svg" alt="edit" />
    </button>
  </div>
</li>
