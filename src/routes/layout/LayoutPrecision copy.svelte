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
    <span class="label"> precision</span>
    <span class="measurement">{precision > 1 ? '1/' + precision : precision}"</span>
  </div>
  <LayoutSlider id="precision" value={precision} range={[1, 64]} on:update={handleUpdate} on:reset={() => {}} />
</div>

<style>
  .box {
    flex-shrink: 1;
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: -17px;
  }
  .measurement {
    text-align: center;
    font-weight: 500;
  }
  .label {
    font-size: small;
    text-align: center;
    padding-right: 0.5rem;
  }
  span {
    text-transform: uppercase;
    width: 100%;
  }
</style>