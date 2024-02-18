<script lang="ts">
  import { onMount } from 'svelte';
  import {formatter} from '$lib/utils/MeasurementConverter';

  export let span: number;
  let displayOptions = { feet: span > 144 };
  let readable = formatter(displayOptions);

  onMount(() => {
    const changeThreshold = span > 144;
    if (displayOptions.feet !== changeThreshold) {
      displayOptions.feet = changeThreshold;
      readable = formatter({ feet: changeThreshold });
    }
  });
</script>

<div class="row">
  <span class="label">Span</span>
  <div class="measurement">
    <span>&#8676;</span>
    <span>{readable(span)}</span>
    <span>&#8677;</span>
  </div>
</div>

<style>
  .row {
    display: flex;
    flex-wrap: nowrap;
  }
  .measurement {
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
    min-width: 4rem;
  }
</style>