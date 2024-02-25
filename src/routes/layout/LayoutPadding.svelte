<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';
  import type { MeasurementOptions, MeasurementPrecision } from '$lib/utils/MeasurementConverter'

  export let start: number;
  export let end: number;
  export let precision: MeasurementPrecision = 8;
  $: displayOptions = { precision };
</script>

<div class="row">
    <span>&#8677;</span>
    <ul>
        <li class="measurement">{sae(start, displayOptions) || '0"'}</li>
        <li class="label">Padding</li>
        <li class="measurement">{sae(end, displayOptions) || '0"'}</li>
    </ul>
    <span>&#8676;</span>
</div>

<style>
  .row {
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
    text-transform: uppercase;
    font-size: small;
  }
  ul {
    list-style: none;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  li {
    padding: 0;
    white-space: nowrap;
    min-width: 3rem;
    text-align: center;
  }
  .row span {
    color: #777;
  }
</style>