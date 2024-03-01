<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';


  export let target: number;
  export let actual: number;
  export let precision = 8;
  $: displayOptions = { feet: false, precision };

</script>

<div class="box">
  <div class="measurement">
    <span class="label">Spacing</span>
    <span class="target">
      <span>{sae(target, displayOptions)}</span>
      <span class="actual">
        {#if actual && target !== actual}
          ({sae(actual, displayOptions)})
        {/if}
      </span>
    </span>
  </div>
</div>

<style>
  .box {
    align-items: center;
  }
  .measurement {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .label {
    width: 100%;
    text-transform: uppercase;
    font-size: small;
  }
  .target {
    display: flex;
    align-items: center;

    width: 100%;
    /* text-align: center; */
    white-space: nowrap;
    /* padding: 0 0.5rem; */
  }
  .target span {
    font-weight: 500;
  }
  .actual {
    width: 100%;
    text-align: right;
    font-size: small;
    white-space: nowrap;
    color: #555;
  }
  span {
    width: 100%;
  }
</style>
