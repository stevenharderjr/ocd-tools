<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';
  import type { MeasurementOptions } from '$lib/utils/MeasurementConverter';

  export let points: number[];
  export let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64 = 8;
  let displayOptions: MeasurementOptions = {};
  $: pointCount = points.length;
  $: span = points[pointCount - 1] - points[0];
  $: displayOptions.precision = precision;
  $: displayOptions.feet = span > 144;
</script>

<span style="text-align: center; font-size: small;">Midpoint: <span class="measurement">{sae(span / 2, displayOptions)}</span></span>
<span class="label">{pointCount} Measurements</span>
<ul>
  {#each points as point, i}
    <li><label for={`point ${i}`}><input id={`point ${i}`} type="checkbox" />{sae(point, displayOptions) || '0"'}</label></li>
  {/each}
</ul>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  ul {
    margin: auto;
    pointer-events: auto;
    list-style: none;
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
  }
  label {
    display: flex;
    align-items: center;
    white-space: nowrap;
    height: 42px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-indent: 6px;
  }
  span {
    white-space: nowrap;
  }
  .label {
    text-transform: uppercase;
    font-size: small;
  }
</style>