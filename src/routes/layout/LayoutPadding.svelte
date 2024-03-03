<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';
  import type { MeasurementOptions, MeasurementPrecision } from '$lib/utils/MeasurementConverter'

  export let start: number;
  export let end: number;
  export let precision: MeasurementPrecision = 8;
  $: max = Math.max(start, end);
  $: displayOptions = { feet: max > 144, precision: 16 };
</script>

<div class="row">
  <!-- <span class="start">Start</span> -->

      <!-- <span class="measurement">{sae(start, displayOptions) || '0"'}<span class="symbol">&#8677;</span></span> -->
      <span class="measurement">{sae(start, displayOptions) || '0"'}</span>

      <span class="small-caps label">Padding</span>

      <span class="end measurement">{sae(end, displayOptions) || '0"'}</span>
      <!-- <span class="end measurement"><span class="symbol">&#8676;</span>{sae(end, displayOptions) || '0"'}</span> -->

  <!-- <span class="end">End</span> -->
  </div>

<style>
  .row {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    font-weight: 500;
  }
  .measurement {
    font-weight: 500;
  }
  .label {
    position: absolute;
    width: 100%;
    /* display: flex;
    justify-content: space-between; */
    white-space: nowrap;
    text-align: center;
  }
  /* .start, .end {
    position: absolute;
    top: -0.75rem;
    font-size: 0.5rem;
    text-transform: uppercase;
    text-align: right;
  } */
  .end {
    right: 0;
    text-align: right;
    white-space: nowrap;
  }
  span {
    white-space: nowrap;
    padding: 0;
    /* flex-grow: 2; */
    /* min-width: 3rem;
    text-align: center; */
  }
  /* .symbol {
    font-size: 1rem;
    color: #777;
    padding: 0 0.5rem;
  } */

  @media screen and (max-width: 320px) {
    .label {
      top: -1rem;
    }
  }
</style>