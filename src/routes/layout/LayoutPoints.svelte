<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';

  export let points: number[];
  export let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64;
  $: pointCount = points.length;
  $: span = points[pointCount - 1] - points[0];
  $: displayOptions = { feet: span > 144, precision: 8 };

</script>

<div class="row">
  <span>{pointCount} Measurement{pointCount === 1 ? '' : 's'}</span>
</div>
<ul on:click|stopPropagation>
  {#each points as point, i}
    <li><label for={`point ${i}`}><input id={`point ${i}`} type="checkbox" />{sae(point, displayOptions) || '0"'}</label></li>
  {/each}
</ul>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  ul {
    pointer-events: auto;
    list-style: none;
    display: grid;
    column-gap: 1rem;
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
</style>