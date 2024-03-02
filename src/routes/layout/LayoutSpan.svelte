<script lang="ts">
  import { onMount } from 'svelte';
  import { sae } from '$lib/utils/MeasurementConverter';
  import type { MeasurementPrecision } from '$lib/utils/MeasurementConverter';

  export let span: number;
  export let precision: MeasurementPrecision = 8;

  $: displayOptions = { precision };

  // onMount(() => {
  //   const changeThreshold = span > 144;
  //   if (displayOptions.feet !== changeThreshold) {
  //     displayOptions.feet = changeThreshold;
  //     readable = formatter({ feet: changeThreshold });
  //   }
  // });
</script>

<div class="row">
  <span class="measurement">{sae(span, displayOptions)}</span>
  <span class="small-caps label">Span</span>
  <span style="font-size: small; text-align: right;">{sae(span / 2, displayOptions)}</span>
  <span class="tiny-caps extra">Midpoint</span>
</div>

<style>
  .row {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
  }
  .measurement {
    font-weight: 500;
    white-space: nowrap;
  }
  .label {
    text-align: center;
    white-space: nowrap;
  }
  .extra {
    position: absolute;
    right: 0;
    top: -0.75rem;
    text-align: right;
  }
  span {
    width: 100%;
  }
</style>