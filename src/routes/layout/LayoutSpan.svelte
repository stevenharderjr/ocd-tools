<script lang="ts">
  import { onMount } from 'svelte';
  import {sae} from '$lib/utils/MeasurementConverter';

  export let span: number;
  export let precision: number = 8;

  // onMount(() => {
  //   const changeThreshold = span > 144;
  //   if (displayOptions.feet !== changeThreshold) {
  //     displayOptions.feet = changeThreshold;
  //     readable = formatter({ feet: changeThreshold });
  //   }
  // });
</script>

<div class="row">
    <span class="label">Span</span>
    <span class="measurement">{sae(span, { feet: span > 144, precision })}</span>
    <span></span>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: space-between;
  }
  .measurement {
    text-align: center;
    font-weight: 500;
    white-space: nowrap;
  }
  .label {
    text-transform: uppercase;
    font-size: small;
  }
  span {
    width: 100%;
  }
</style>