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
    <span class="label">Span</span>
    <span class="measurement">{sae(span, displayOptions)}</span>
    <span style="font-size: small; text-align: right;">({sae(span / 2, displayOptions)})</span>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
  }
  .measurement {
    text-align: center;
    font-weight: 500;
    white-space: nowrap;
  }
  .label {
    text-transform: uppercase;
    font-size: small;
    white-space: nowrap;
  }
  span {
    width: 100%;
  }
</style>