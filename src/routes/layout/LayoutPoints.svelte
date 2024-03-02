<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';

  export let points: number[];
  export let precision: 1 | 2 | 4 | 8 | 16 | 32 | 64 = 8;
  $: pointCount = points.length;
  $: displayOptions = { precision };
</script>

<span class="small-caps">Measurements ({pointCount})</span>
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
    width: 100%;
    pointer-events: auto;
    list-style: none;
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 2fr 1fr;
    justify-self: center;
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
  .small-caps {
    text-align: center;
    /* font-size: 0.9rem;
    letter-spacing: 1.5px; */
  }
</style>