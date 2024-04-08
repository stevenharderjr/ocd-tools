<script lang="ts">
  import SlideTracker from '$lib/SlideTracker.svelte';
  import { round } from '$lib/utils/round';

  let h = 0;
  let v = 0;
  const precision = [1, 42];
  let min = 0;
  let max = 100;


  function handleChange({ detail }) {
    const [deltaH, deltaV] = detail;
    console.log({ deltaH, deltaV });

    v = ~~(v + deltaV);
    if (v > 16) v = 16;
    else if (v < 1) v = 1;

    h = ~~(h + deltaH);

    if (h > max) h = max;
    else if (h < min) h = min;
  }
</script>

<div class="backdrop">
  <div class="card-stack">
    <div class="floating card">
      <div class="content">
        <h2>{h}, {v}</h2>
        <SlideTracker on:change={handleChange} />
      </div>
    </div>
  </div>
</div>

<style>
    .backdrop {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: space-between;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
