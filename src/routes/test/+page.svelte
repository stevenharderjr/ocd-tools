<script lang="ts">
  import InvisibleSlider from '$lib/InvisibleSlider.svelte';

  let value = 50;
  let min = 0;
  let max = 100;

  function handleChange({ detail: { value: update } }) {
    value = update;
  }
</script>

<div class="backdrop">
  <div class="card-stack">
    <div class="floating card">
      <div class="content">
        <h2>{value}</h2>
        <InvisibleSlider {value} {min} {max} on:change={handleChange} />
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
