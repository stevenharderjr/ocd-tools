<script lang="ts">
  import { formatter, measurement } from '$lib/utils/MeasurementConverter';

  export let points: number[];
  const span = points[points.length - 1] - points[0];
  const displayOptions = { feet: span > 144 };
  const readable = formatter(displayOptions);
</script>

<ul on:click|stopPropagation>
  {#each points as point, i}
    <li><label for={`point ${i}`}><input id={`point ${i}`} type="checkbox" />{readable(point) || '0"'}</label></li>
  {/each}
</ul>

<style>
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