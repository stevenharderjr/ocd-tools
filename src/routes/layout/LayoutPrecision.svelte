<script lang="ts">
  import LayoutSlider from './LayoutSlider.svelte';
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let precision: number;

  function handleUpdate({ detail: { id, value } }: any) {
    if (value > 1) {
      if (value > precision && value !== precision * 2) value = precision * 2;
      else if (value < precision && value !== precision / 2) value = precision / 2;
    }
    dispatch('update', { id, value });
  }
</script>

<div class="box">
  <div class="row">
    <span class="label">Precision</span>
    <span class="measurement">{precision > 1 ? '1/' + precision : precision}"</span>
  </div>
  <LayoutSlider id="precision" value={precision} range={[1, 64]} on:update={handleUpdate} on:reset={() => {}} />
</div>

<style>
  .box {
    flex-shrink: 1;
    margin-right: 0.5rem;
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
    margin-bottom: -1.5rem;
  }
  .measurement {
    text-align: center;
  }
  /* .label {
    text-align: center;
  } */
  span {
    font-size: small;
    width: 100%;
  }
</style>