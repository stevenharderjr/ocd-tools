<script lang="ts">
  import { onMount } from 'svelte';
  import {formatter} from '$lib/utils/MeasurementConverter';

  export let span: number;
  let displayOptions = { feet: span > 144 };
  let readable = formatter(displayOptions);
  console.log({ span });

  onMount(() => {
    const changeThreshold = span > 144;
    if (displayOptions.feet !== changeThreshold) {
      displayOptions.feet = changeThreshold;
      readable = formatter({ feet: changeThreshold });
    }
  });
</script>

<div class="grid">
  <span class="label">Span</span>
  <div class="measurement">
    <span>&#8676;</span>
    <span>{readable(span)}</span>
    <span>&#8677;</span>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .measurement {
    grid-column: 2/4;
    display: flex;
    width: 100%;
    max-width: 10rem;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .label {
    font-size: 0.9rem;
    padding-right: 2rem;
  }
</style>