<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { measurement } from '$lib/utils/freedomFractions';
  const dispatch = createEventDispatcher();

  export let layout: App.LayoutFlag;
  const {spacing, points, span } = layout || {};
  const [start, end] = layout?.padding || [];
  const details = [
    span + ' span',
    'Points: ' + points?.map(point => measurement.fromDecimalInches(point)).join(', '),
    spacing + ' spacing',
    (start === end)
      ? start + ' padding'
      : 'Padding: ' + start + ', ' + end
  ];

  function cancel() {
    dispatch('close');
  }
</script>

<li class="floating card">
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
